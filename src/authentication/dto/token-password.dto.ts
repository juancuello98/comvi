import {IsNotEmpty, IsEmail} from 'class-validator'

export class PasswordTokenDTO {

    @IsNotEmpty()
    passwordToken : string;

    @IsEmail() @IsNotEmpty()
    email: string;
}