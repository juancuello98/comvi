import { IsString, IsNotEmpty, IsArray } from 'class-validator';

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

    @IsArray()
    pics : string []; //urls de imagenes
    
}
