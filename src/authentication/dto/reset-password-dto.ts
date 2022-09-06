import { PartialType } from '@nestjs/mapped-types';
import { ExistingtUserDTO } from 'src/models/users/dto/existing-user.dto';

export class ResetPasswordDTO extends PartialType(ExistingtUserDTO){
}