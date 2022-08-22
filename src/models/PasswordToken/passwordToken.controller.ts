import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PasswordTokenService } from './passwordToken.service';



@ApiTags('passwordtoken')
@Controller('passwordtoken')
export class PasswordTokenController {
  constructor(private readonly passwordToken: PasswordTokenService) {}

}

