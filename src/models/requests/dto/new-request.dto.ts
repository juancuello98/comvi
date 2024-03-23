import { IsNotEmpty, IsNumber, IsBoolean, IsString } from 'class-validator';

export class NewRequestDTO {
  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  hasEquipment: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasPartner: boolean;

  @IsNumber()
  partnerQuantity: number;
}
