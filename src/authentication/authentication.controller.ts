import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './authentication.service';

import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';

import { UserDetails } from 'src/models/users/interfaces/user-details.interface';
import { UserValidated } from 'src/models/users/interfaces/user-validated.interface';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RequestResetPasswordDTO } from '../models/PasswordToken/dto/request-reset-password-dto';
import { ResetPasswordDTO } from '../models/PasswordToken/dto/reset-password-dto';
import { PasswordTokenDTO } from '../models/PasswordToken/dto/token-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: NewUserDTO): Promise< UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('validate/token')
  @HttpCode(200)
  validateTokenEmail(@Body() user: UserVerificationDTO) :  Promise< UserValidated | any > {
    return this.authService.validationCode(user);
  }

  @Post('validate/passwordtoken')
  @HttpCode(200)
  validatePasswordToken(@Body() token: PasswordTokenDTO) :  Promise< UserValidated | any > {
    return this.authService.validatePasswordToken(token);
  }

  
  @Post('login')
  @HttpCode(200)
  loginUser(@Body() user: ExistingtUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @Post('resetpassword/requestresetpassword')
  @HttpCode(200)
  requestResetPassword(@Body() token: RequestResetPasswordDTO) :  Promise< boolean | any > {
    return this.authService.requestResetPassword(token);
  }

  @Post('resetpassword/resetpassword')
  @HttpCode(200)
  resetPassword(@Body() token: ResetPasswordDTO) :  Promise< boolean | any > {
    return this.authService.resetPassword(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  @HttpCode(200)
  testUser(@Body() user: ExistingtUserDTO) {
    return { email: user.email}
  }

}
