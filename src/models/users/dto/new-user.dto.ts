import { PartialType } from '@nestjs/mapped-types';
import { LoginDTO } from './existing-user.dto';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { Person } from 'src/models/person/schema/person.schema';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';

export class NewUserDTO extends CreatePersonDto {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  avatar: string;



}
