import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty, IsNumber, IsBoolean, IsString} from 'class-validator';

export class ActionRequestDTO {
    
    @ApiProperty({
        description: 'id del viaje que de la solicitud',
        name:"tripId"
        })
    @IsString()
    tripId : string;

    @ApiProperty({
        description: 'id de la solicitud a la cual se va a responder',
        name:"requestId"
        })
    @IsString()
    @IsNotEmpty()
    requestId : string;

    
}