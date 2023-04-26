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
    try {
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
            const capital = await this.getCountryCapital(c.sISOCode);
            const currency = await this.getCountryCurrency(c.sISOCode);
            const flag = await this.getCountryFlag(c.sISOCode);
            const dialCode = await this.getCountryDialCode(c.sISOCode);
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
    } catch (error) {
      console.log(error);
    }
  }

  async getCountryCapital(country: string): Promise<string> {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async getCountryCurrency(
    country: string
  ): Promise<{ name: string; isoCode: string }> {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async getCountryFlag(country: string): Promise<string> {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async getCountryDialCode(country: string): Promise<string> {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }
}
