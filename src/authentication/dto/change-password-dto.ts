import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { LoginDTO } from 'src/models/users/dto/existing-user.dto';

export class ChangePasswordDTO extends PartialType(LoginDTO) {
    @MaxLength(14)
    @IsNotEmpty()
    newPassword?: string;
}