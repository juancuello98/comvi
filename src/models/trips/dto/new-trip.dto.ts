import { PartialType } from '@nestjs/mapped-types';
import {IsDate, IsNotEmpty} from 'class-validator'
import { ExistingtTripDTO } from './existing-trip.dto';

export class NewTripDTO extends PartialType(ExistingtTripDTO) {

    @IsNotEmpty() // para propiedades requeridas
    origin : string;
  
    @IsNotEmpty()
    destination : string;

    @IsNotEmpty()
    peopleCapacity : number;

    @IsNotEmpty() 
    driverEmail : string;

    @IsNotEmpty()
    checkOut : string
    
    @IsNotEmpty()
    checkIn: string

    @IsNotEmpty() 
    status : string;

}