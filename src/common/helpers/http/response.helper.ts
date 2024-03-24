import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ResponseDTO } from '../../interfaces/responses.interface';

@Injectable()
export class ResponseHelper {
  private readonly logger = new Logger(ResponseHelper.name);

  constructor() {}

  /**
   * Genera una respuesta estandarizada.
   *
   * @param {boolean} hasError - Indica si hay un error en la operación.
   * @param {string} message - Mensaje asociado a la respuesta.
   * @param {any} data - Datos asociados a la respuesta.
   * @param {HttpStatus} status - Estado HTTP asociado a la respuesta.
   * @returns {ResponseDTO} - Objeto de respuesta estandarizado.
   */
  makeResponse(
    hasError: boolean,
    message: string,
    data: any,
    status: HttpStatus,
  ): ResponseDTO {
    this.logger.log(message);
    return {
      hasError: hasError,
      message: message,
      data: data,
      status,
    };
  }
}
