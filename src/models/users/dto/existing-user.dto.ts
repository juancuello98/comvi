import {IsEmail , IsNotEmpty} from 'class-validator'

export class ExistingtUserDTO {

    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    password?: string;

}
