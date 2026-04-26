import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ProductIdNumber } from '../../fuels/enums/fuel-type.enum'; // Adjust the import path as necessary

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  patentPlate: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsArray()
  pics: string[]; //TODO: urls de imagenes

  @IsOptional()
  @IsNumber()
  consumption: number;

  @IsOptional()
  @IsArray()
  @IsEnum(ProductIdNumber, { each: true })
  fuels: ProductIdNumber[];

}
