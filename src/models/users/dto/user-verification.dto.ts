import { IsEmail, IsNotEmpty} from 'class-validator';

export class UserVerificationDTO {
    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    @IsEmail()
    email: string
}
