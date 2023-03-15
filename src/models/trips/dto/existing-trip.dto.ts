
import {IsNotEmpty} from 'class-validator'

export class ExistingtTripDTO {

    @IsNotEmpty()
    id: string;

}