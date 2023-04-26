import { Module } from "@nestjs/common";
import { CountryController } from "@ms/country/country.controller";
import { CountryService } from "@ms/country/services/country.service";
import { CountrySourceRegistry } from "@ms/country/services/country-source.registry";
import { SoapWebService } from "@ms/country/services/sources/soap-webservice";

@Module({
  imports: [],
  controllers: [CountryController],
  providers: [CountryService, CountrySourceRegistry, SoapWebService],
})
export class CountryModule {}
