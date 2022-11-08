import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusRequest } from '../enums/status.enum';
import { ActionRequestDTO } from './action-request.dto';
import { NewRequestDTO } from './new-request.dto';

export class ChangeStatusOfRequestDTO extends PartialType(ActionRequestDTO){
 
    @ApiProperty({
        description: 'nuevo estado de la solicitud respondida',
        name:"newStatus",
        enum:StatusRequest
        })
        @IsString()
    @IsEnum(StatusRequest)
    @IsNotEmpty()
    @IsOptional()
    newStatus : string;
    
    @ApiProperty({
        description: 'nuevo estado de la solicitud respondida',
        name:"newStatus",
        enum:StatusRequest
        })
    @IsString()
    @IsNotEmpty()
    description: string; 
    
}
