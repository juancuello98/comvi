import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString} from 'class-validator'
import { Vehicle } from 'src/models/cars/location.schema';
import { Location } from '../../locations/location.schema';
import { ExistingtTripDTO } from './existing-trip.dto';

export class NewTripDTO extends PartialType(ExistingtTripDTO) {

    @IsOptional()
    email : string;

    @IsNotEmpty() // para propiedades requeridas
    origin : Location;
  
    @IsNotEmpty()
    destination : Location;

    @IsString()
    @IsNotEmpty()
    description : string;

    @IsBoolean()
    @IsNotEmpty()
    allowPackage : boolean;

    @IsBoolean()
    @IsNotEmpty() 
    allowPassenger : boolean;

    @IsNumber()
    @IsNotEmpty()
    peopleQuantity : number;
    
    @IsNotEmpty()
    vehicle: Vehicle;

    @IsString()
    @IsNotEmpty()
    startedTimestamp: string;

}