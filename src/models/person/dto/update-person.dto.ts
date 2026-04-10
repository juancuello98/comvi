import { Type } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class UpdatePersonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsInt()
  dni: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @IsString()
  picture: string;  

}
