import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
