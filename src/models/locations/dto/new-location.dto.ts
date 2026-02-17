import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewLocationDTO {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  locality: string;

  @IsString()
  @IsNotEmpty()
  format_address: string;

  /**
   * Latitud - acepta string o number, se convierte a number.
   */
  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @IsNotEmpty()
  latitude: string | number;

  /**
   * Longitud - acepta string o number, se convierte a number.
   */
  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @IsNotEmpty()
  longitude: string | number;

  @IsString()
  @IsNotEmpty()
  place_id: string;
}
