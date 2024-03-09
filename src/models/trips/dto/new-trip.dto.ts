import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString} from 'class-validator'
import { ExistingtTripDTO } from './existing-trip.dto';

export class NewTripDTO extends PartialType(ExistingtTripDTO) {

    @IsOptional()
    driver : string;

    @IsNotEmpty()
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
    vehicle: string;

    @IsString()
    @IsNotEmpty()
    startedTimestamp: string;

}