import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
    @IsArray()
    pics: string[];
}
