import {IsEmail , IsNotEmpty, MaxLength, MinLength} from 'class-validator'

export class ExistingtUserDTO {


    @IsEmail()
    email?: string;

    @MinLength(8)
    @MaxLength(14)
    @IsNotEmpty()
    password?: string;
}
