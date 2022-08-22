import {IsEmail, IsNotEmpty, MaxLength , MinLength} from 'class-validator'

export class ResetPasswordDTO {

    @IsEmail() @IsNotEmpty()
    email: string;

    @MinLength(8)
    @MaxLength(14)
    password: string;

}