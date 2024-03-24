import { PartialType } from '@nestjs/mapped-types';
import { LoginDTO } from './existing-user.dto';
import { IsNotEmpty } from 'class-validator';

export class NewUserDTO extends PartialType(LoginDTO) {
  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
