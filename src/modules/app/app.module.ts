import { Module } from "@nestjs/common";
import { AppController } from "@ms/app/app.controller";
import { AppService } from "@ms/app/services/app.service";
import { CountryModule } from "@ms/country/country.module";

@Module({
  imports: [CountryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
