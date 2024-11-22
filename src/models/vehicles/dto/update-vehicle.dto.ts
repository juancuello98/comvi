import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductIdNumber } from '../enums/fuel-type.enum';

export class UpdateVehicleDto {
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
    @IsNumber()
    consumption: number;

    @IsOptional()
    @IsArray()
    pics: any[];


  
    @IsNotEmpty()
      @IsEnum(ProductIdNumber, { each: true })
    fuels: ProductIdNumber[];


}
