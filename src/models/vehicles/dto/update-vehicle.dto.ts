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
    age: number;
  
    @IsOptional()
    @IsArray()
    pics: string[];
}
