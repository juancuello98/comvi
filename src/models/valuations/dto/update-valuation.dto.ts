import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Puntaje } from '../entities/puntaje.enums';
import { CreateValuationDto } from './create-valuation.dto';

export class UpdateValuationDto extends PartialType(CreateValuationDto) 
{
    @IsNotEmpty()
    id: string;

    detalle : string ;
    
    puntaje : Puntaje;

}
