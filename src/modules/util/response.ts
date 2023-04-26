import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";

@Injectable()
export class ResponseService {
  static json(res: any, statusCode: number, message: string, data?: any): any {
    const responseObj: any = {};
    responseObj.message = message;

    if (!isNil(data)) {
      responseObj.data = data;
    }
    res.status(statusCode).send(responseObj);
  }
}
