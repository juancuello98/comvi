import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsBoolean, IsString } from 'class-validator';

export class NewRequestDTO {

  @ApiProperty({
    description: 'UUID del viaje',
    name: 'tripId',
  })
  @IsString()
  @IsNotEmpty()
  tripId: string
  ;
  @ApiProperty({
    description: 'mensaje de la solicitud',
    name: 'description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  
  @ApiProperty({
    description: 'Booleano que indica si la solicitud tiene equipaje',
    name: 'hasEquipment',

  })
  @IsBoolean()
  @IsNotEmpty()
  hasEquipment: boolean = false;

  @ApiProperty({
    description: 'Booleano que indica si la solicitud tiene acompañante',
    name: 'hasPartner',
  })
  @IsBoolean()
  @IsNotEmpty()
  hasPartner: boolean = false;

  @ApiProperty({
    description: 'Cantidad de acompañantes',
    name: 'partnerQuantity',

  })
  @IsNumber()
  partnerQuantity: number = 0;
}
