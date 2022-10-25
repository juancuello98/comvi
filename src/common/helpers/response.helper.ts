import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../interfaces/responses.interface';

@Injectable()
export class ResponseHelper {

  constructor() {}

  makeResponse = (hasError: boolean, message: string,data:any,status: HttpStatus) : ResponseDTO => {
    return {
      hasError: hasError,
      message: message,
      data: data,
      status: status
    }
  }
}

