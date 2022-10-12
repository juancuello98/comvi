import { HttpStatus } from "@nestjs/common";

export interface ResponseDTO {
  hasError: boolean;
  errorMessage: string;
  data: any;
  status: HttpStatus;
}