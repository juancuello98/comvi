import { IsNotEmpty, IsOptional, IsNumber, Min, Max, IsArray, IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateValuationDto {
  @ApiPropertyOptional({ description: 'Email del usuario que crea la valoración (se obtiene del token JWT)' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Email del usuario que está siendo valorado' })
  @IsNotEmpty()
  @IsString()
  valoradoEmail: string;

  @ApiProperty({ description: 'ID del viaje asociado' })
  @IsNotEmpty()
  @IsString()
  tripId: string;

  @ApiProperty({ description: 'Puntaje de 1 a 5 estrellas', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  puntaje: number;

  @ApiPropertyOptional({ description: 'Comentario opcional de la valoración' })
  @IsOptional()
  @IsString()
  detalle?: string;

  @ApiPropertyOptional({ description: 'Tags seleccionados', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ description: 'Indica si el usuario pagó lo acordado' })
  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;
}
