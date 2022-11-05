import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ResponseDTO } from '../../interfaces/responses.interface';

@Injectable()
export class ResponseHelper {

  private readonly logger = new Logger(ResponseHelper.name);

  constructor() {}

  makeResponse = (hasError: boolean, message: string,data:any,status: HttpStatus) : ResponseDTO => {
    this.logger.log(message);
    return {
      hasError: hasError,
      message: message,
      data: data,
      status: status
    }
  }
}

