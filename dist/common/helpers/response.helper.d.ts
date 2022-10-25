import { HttpStatus } from '@nestjs/common';
import { ResponseDTO } from '../interfaces/responses.interface';
export declare class ResponseHelper {
    constructor();
    makeResponse: (hasError: boolean, message: string, data: any, status: HttpStatus) => ResponseDTO;
}
