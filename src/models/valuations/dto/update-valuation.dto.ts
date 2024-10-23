import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Puntaje } from '../entities/puntaje.enums';
import { CreateValuationDto } from './create-valuation.dto';

export class UpdateValuationDto extends PartialType(CreateValuationDto) {
  @ApiProperty({ description: 'ID de la valoración', type: String })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Detalles adicionales', required: false })
  detalle: string;

  @ApiProperty({ description: 'Puntaje de la valoración', enum: Puntaje, required: false })
  puntaje: Puntaje;
}