import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { NewRequestDTO } from './new-request.dto';

export class ExtendedRequestDTO extends PartialType(NewRequestDTO){
 
    @IsEmail()
    @IsNotEmpty()
    email : string;
    
}