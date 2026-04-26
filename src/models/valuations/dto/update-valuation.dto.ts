import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateValuationDto } from './create-valuation.dto';

export class UpdateValuationDto extends PartialType(CreateValuationDto) {
  @ApiProperty({ description: 'ID de la valoración', type: String })
  @IsNotEmpty()
  @IsString()
  id: string;
}
