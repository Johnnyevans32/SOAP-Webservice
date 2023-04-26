import { Injectable } from "@nestjs/common";
import {
  CountrySource,
  CountrySourceRegistry,
} from "@ms/country/services/country-source.registry";

@Injectable()
export class CountryService {
  constructor(private countrySourceRegistry: CountrySourceRegistry) {}

  async getCountries() {
    const countrySourceService = this.countrySourceRegistry.getSourceService(
      CountrySource.SoapWebService
    );
    return countrySourceService.getCountries();
  }

  async getCountryCapital(country: string) {
    const countrySourceService = this.countrySourceRegistry.getSourceService(
      CountrySource.SoapWebService
    );
    return countrySourceService.getCountryCapital(country);
  }

  async getCountryCurrency(country: string) {
    const countrySourceService = this.countrySourceRegistry.getSourceService(
      CountrySource.SoapWebService
    );
    return countrySourceService.getCountryCurrency(country);
  }

  async getCountryFlag(country: string) {
    const countrySourceService = this.countrySourceRegistry.getSourceService(
      CountrySource.SoapWebService
    );
    return countrySourceService.getCountryFlag(country);
  }

  async getCountryDialCode(country: string) {
    const countrySourceService = this.countrySourceRegistry.getSourceService(
      CountrySource.SoapWebService
    );
    return countrySourceService.getCountryDialCode(country);
  }
}
