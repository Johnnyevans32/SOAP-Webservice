import { Injectable } from "@nestjs/common";
import {
  ICountry,
  ICountrySourceService,
} from "@ms/country/services/country-source.registry";
import { parseStringPromise, processors } from "xml2js";
import RequestService from "@ms/util/request";

@Injectable()
export class SoapWebService
  extends RequestService
  implements ICountrySourceService
{
  private xmlParseOptions: any;
  constructor() {
    super({
      method: "post",
      maxBodyLength: Infinity,
      baseURL:
        "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
    });
    this.xmlParseOptions = {
      trim: true,
      ignoreAttrs: true,
      explicitArray: false,
      tagNameProcessors: [processors.stripPrefix],
    };
  }
  async getCountries(): Promise<ICountry[]> {
    const xmlData = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
          <soap:Body>\n
            <ListOfCountryNamesByName xmlns="http://www.oorsprong.org/websamples.countryinfo">\n
            </ListOfCountryNamesByName>\n
          </soap:Body>\n
        </soap:Envelope>`;

    const xmlRes = await this.request({ data: xmlData });

    const {
      Envelope: {
        Body: {
          ListOfCountryNamesByNameResponse: {
            ListOfCountryNamesByNameResult: { tCountryCodeAndName },
          },
        },
      },
    } = await parseStringPromise(xmlRes, this.xmlParseOptions);
    const result = await Promise.all(
      tCountryCodeAndName.map(
        async (c: { sName: string; sISOCode: string }) => {
          // this is sorta an expensive operation but due to the architecture of the service and requirements i have no choice
          const [capital, currency, flag, dialCode] = await Promise.all([
            this.getCountryCapital(c.sISOCode),
            this.getCountryCurrency(c.sISOCode),
            this.getCountryFlag(c.sISOCode),
            this.getCountryDialCode(c.sISOCode),
          ]);
          console.log(capital, currency, flag, dialCode);

          return {
            name: c.sName,
            isoCode: c.sISOCode,
            capital,
            currency,
            flag,
            dialCode,
          };
        }
      )
    );
    return result;
  }

  async getCountryCapital(country: string): Promise<string> {
    const xmlData = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
          <soap:Body>\n
            <CapitalCity xmlns="http://www.oorsprong.org/websamples.countryinfo">\n
              <sCountryISOCode>${country}</sCountryISOCode>\n    
            </CapitalCity>\n
          </soap:Body>\n
        </soap:Envelope>`;

    const xmlRes = await this.request({ data: xmlData });

    const {
      Envelope: {
        Body: {
          CapitalCityResponse: { CapitalCityResult },
        },
      },
    } = await parseStringPromise(xmlRes, this.xmlParseOptions);
    return CapitalCityResult;
  }

  async getCountryCurrency(
    country: string
  ): Promise<{ name: string; isoCode: string }> {
    const xmlData = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
          <soap:Body>\n
            <CountryCurrency xmlns="http://www.oorsprong.org/websamples.countryinfo">\n
              <sCountryISOCode>${country}</sCountryISOCode>\n    
            </CountryCurrency>\n
          </soap:Body>\n
        </soap:Envelope>`;

    const xmlRes = await this.request({ data: xmlData });

    const {
      Envelope: {
        Body: {
          CountryCurrencyResponse: {
            CountryCurrencyResult: { sName: name, sISOCode: isoCode },
          },
        },
      },
    } = await parseStringPromise(xmlRes, this.xmlParseOptions);
    return {
      name,
      isoCode,
    };
  }

  async getCountryFlag(country: string): Promise<string> {
    const xmlData = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
          <soap:Body>\n
            <CountryFlag xmlns="http://www.oorsprong.org/websamples.countryinfo">\n
              <sCountryISOCode>${country}</sCountryISOCode>\n    
            </CountryFlag>\n
          </soap:Body>\n
        </soap:Envelope>`;

    const xmlRes = await this.request({ data: xmlData });

    const {
      Envelope: {
        Body: {
          CountryFlagResponse: { CountryFlagResult },
        },
      },
    } = await parseStringPromise(xmlRes, this.xmlParseOptions);
    return CountryFlagResult;
  }

  async getCountryDialCode(country: string): Promise<string> {
    const xmlData = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
          <soap:Body>\n
            <CountryIntPhoneCode xmlns="http://www.oorsprong.org/websamples.countryinfo">\n
              <sCountryISOCode>${country}</sCountryISOCode>\n    
            </CountryIntPhoneCode>\n
          </soap:Body>\n
        </soap:Envelope>`;

    const xmlRes = await this.request({ data: xmlData });

    const {
      Envelope: {
        Body: {
          CountryIntPhoneCodeResponse: { CountryIntPhoneCodeResult },
        },
      },
    } = await parseStringPromise(xmlRes, this.xmlParseOptions);
    return CountryIntPhoneCodeResult;
  }
}
