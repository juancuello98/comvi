import { PartialType } from '@nestjs/mapped-types';
import { LoginDTO } from 'src/models/users/dto/existing-user.dto';

export class ResetPasswordDTO extends PartialType(LoginDTO){
}