import { PartialType } from '@nestjs/mapped-types';
import { ExistingtUserDTO } from './existing-user.dto';
import { IsNotEmpty} from 'class-validator'

export class NewUserDTO extends PartialType(ExistingtUserDTO) {

    @IsNotEmpty()
    lastname: string

    @IsNotEmpty()
    name:string

}
