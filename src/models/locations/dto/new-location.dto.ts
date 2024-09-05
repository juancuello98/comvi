import { IsNotEmpty, IsString } from 'class-validator';

export class NewLocationDTO {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  departament: string;

  @IsString()
  @IsNotEmpty()
  locality: string;

  @IsString()
  @IsNotEmpty()
  format_address: string;

  @IsString()
  @IsNotEmpty()
  latitud: string;

  @IsString()
  @IsNotEmpty()
  longitud: string;

  @IsString()
  @IsNotEmpty()
  place_id: string;
}
