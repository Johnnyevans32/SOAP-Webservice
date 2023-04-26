import { Injectable } from "@nestjs/common";
import { SoapWebService } from "@ms/country/services/sources/soap-webservice";

export enum CountrySource {
  SoapWebService = "SoapWebService",
}

export interface ICountrySourceService {
  getCountries(): Promise<ICountry[]>;
  getCountryCurrency(
    country: string
  ): Promise<{ name: string; isoCode: string }>;
  getCountryCapital(country: string): Promise<string>;
  getCountryFlag(country: string): Promise<string>;
  getCountryDialCode(country: string): Promise<string>;
}

export interface ICountry {
  name: string;
  capital: string;
  currency: { name: string; isoCode: string };
  flag: string;
  dialCode: string;
  isoCode: string;
}

@Injectable()
export class CountrySourceRegistry {
  private registry = new Map<CountrySource, ICountrySourceService>();

  constructor(private soapWebService: SoapWebService) {
    this.registerServices();
  }

  registerSource(key: CountrySource, service: ICountrySourceService): void {
    this.registry.set(key, service);
  }

  getSourceService(key: CountrySource): ICountrySourceService {
    return this.registry.get(key);
  }

  registerServices(): void {
    this.registerSource(CountrySource.SoapWebService, this.soapWebService);
  }
}
