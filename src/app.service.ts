import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {
    const response = {
      message : "Hola Mundo",
      statusCode : 200,
    }
    return response;
  }
}
