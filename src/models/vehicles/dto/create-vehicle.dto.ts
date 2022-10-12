import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateVehicleDto {
    
    @IsNotEmpty()
    @IsString()
    patentPlate : string;

    @IsNotEmpty()
    @IsString()
    model : string;

    @IsNotEmpty()
    @IsString()
    brand : string;


    @IsOptional()
    @IsString()
    color : string;


    @IsOptional()
    @IsString()
    mail : string;

    @IsOptional()
    @IsArray()
    pics : string []; //urls de imagenes
    
}
