import { IsNotEmpty, IsOptional } from 'class-validator';
import { Puntaje } from '../entities/puntaje.enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating a valuation.
 * This class is used to define the structure of the data required to create a new valuation.
 */
export class CreateValuationDto {
  @ApiPropertyOptional({ description: 'Email del usuario' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'ID del viaje', type: String })
  @IsNotEmpty()
  @IsString()
  valoradoEmail: string;

  @ApiProperty({ description: 'ID del viaje asociado' })
  @IsNotEmpty()
  @IsString()
  tripId: string;

  @ApiPropertyOptional({ description: 'Detalles adicionales' })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ description: 'Puntaje de la valoración', enum: Puntaje })
  @IsNotEmpty()
  puntaje: Puntaje;
}
