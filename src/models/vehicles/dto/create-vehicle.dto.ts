import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

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
}
