import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { CreateValuationDto } from './create-valuation.dto';

export class UpdateValuationDto extends PartialType(CreateValuationDto) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  detalle?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  puntaje?: number;
}
