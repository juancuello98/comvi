import {IsEmail , MaxLength , MinLength} from 'class-validator'

export class LoginAuthDTO {

    @IsEmail()
    email : string;

    @MinLength(8)
    @MaxLength(14)
    password: string;

}
