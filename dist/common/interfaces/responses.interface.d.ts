import { HttpStatus } from '@nestjs/common';
export interface ResponseDTO {
    hasError: boolean;
    message: string;
    data: any;
    status: HttpStatus;
}
