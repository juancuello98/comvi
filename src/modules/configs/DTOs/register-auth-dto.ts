import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDTO } from './login-auth.dto';
import { IsNotEmpty , IsOptional} from 'class-validator'

export class RegisterAuthDto extends PartialType(LoginAuthDTO) {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    username: string

}
