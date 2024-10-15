import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { LoginDTO } from 'src/models/users/dto/existing-user.dto';

export class ResetPasswordDTO extends PartialType(LoginDTO) {
    @IsNotEmpty()
    passwordToken?: string;
}
