import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email?: string;

  @MinLength(8)
  @MaxLength(14)
  @IsNotEmpty()
  password?: string;
}
