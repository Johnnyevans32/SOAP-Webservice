import { Controller, Get, Param, Res } from "@nestjs/common";
import { CountryService } from "@ms/country/services/country.service";
import { Response } from "express";
import { ResponseService } from "@ms/util/response";

@Controller("country")
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get("all")
  async getCountries(@Res() res: Response) {
    try {
      const data = await this.countryService.getCountries();

      return ResponseService.json(res, 200, "success", data);
    } catch (err) {
      return ResponseService.json(res, 400, err.message);
    }
  }
  @Get("capital/:country")
  async getCountryCapital(
    @Param("country") country: string,
    @Res() res: Response
  ) {
    try {
      const data = await this.countryService.getCountryCapital(country);

      return ResponseService.json(res, 200, "success", data);
    } catch (err) {
      return ResponseService.json(res, 400, err.message);
    }
  }
  @Get("currency/:country")
  async getCountryCurrency(
    @Param("country") country: string,
    @Res() res: Response
  ) {
    try {
      const data = await this.countryService.getCountryCurrency(country);

      return ResponseService.json(res, 200, "success", data);
    } catch (err) {
      return ResponseService.json(res, 400, err.message);
    }
  }
  @Get("flag/:country")
  async getCountryFlag(
    @Param("country") country: string,
    @Res() res: Response
  ) {
    try {
      const data = await this.countryService.getCountryFlag(country);

      return ResponseService.json(res, 200, "success", data);
    } catch (err) {
      return ResponseService.json(res, 400, err.message);
    }
  }
  @Get("dialCode/:country")
  async getCountryDialCode(
    @Param("country") country: string,
    @Res() res: Response
  ) {
    try {
      const data = await this.countryService.getCountryDialCode(country);

      return ResponseService.json(res, 200, "success", data);
    } catch (err) {
      return ResponseService.json(res, 400, err.message);
    }
  }
}
