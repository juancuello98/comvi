import { IsString, IsInt, IsNotEmpty, IsEmpty } from 'class-validator';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';

export class CreateUserDto extends CreatePersonDto {


  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  status: string;
  
  @IsEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  verificationCode: string;
}
