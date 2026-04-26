import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateValuationDto {
  @ApiPropertyOptional({ description: 'Email del usuario que emite la valoración (inyectado desde JWT)' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Email del usuario que recibe la valoración' })
  @IsNotEmpty()
  @IsString()
  valoradoEmail: string;

  @ApiProperty({ description: 'ID del viaje asociado' })
  @IsNotEmpty()
  @IsString()
  tripId: string;

  @ApiProperty({ description: 'Puntaje de la valoración (1-5)', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  puntaje: number;

  @ApiPropertyOptional({ description: 'Comentario opcional de la valoración' })
  @IsOptional()
  @IsString()
  detalle?: string;

  @ApiPropertyOptional({ description: 'Etiquetas opcionales de la valoración' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Indica si el pasajero abonó el viaje' })
  @IsOptional()
  @IsBoolean()
  paid?: boolean;
}
