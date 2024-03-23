import { IsNotEmpty, IsOptional } from 'class-validator';
import { Puntaje } from '../entities/puntaje.enums';

export class CreateValuationDto {
  @IsOptional()
  email: string;

  @IsNotEmpty()
  tripId: string;

  @IsOptional()
  detalle: string;

  @IsNotEmpty()
  puntaje: Puntaje;
}
