import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './authentication.service';

import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';

import { UserDetails } from 'src/models/users/interfaces/user-details.interface';
import { UserValidated } from 'src/models/users/interfaces/user-validated.interface';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RequestResetPasswordDTO } from './dto/request-reset-password-dto';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { PasswordTokenDTO } from './dto/token-password.dto';

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
  
  @Post('login')
  @HttpCode(200)
  loginUser(@Body() user: ExistingtUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
  
  @Post('/passwordtoken/validate')
  @HttpCode(200)
  validatePasswordToken(@Body() token: PasswordTokenDTO) :  Promise< UserValidated | any > {
    return this.authService.validatePasswordToken(token);
  }
  
  @Post('/requestresetpassword')
  @HttpCode(200)
  requestResetPassword(@Body() req: RequestResetPasswordDTO) :  Promise< boolean | any > {
    const {email} = req;
    return this.authService.requestResetPassword(email);
  }

  @Post('/resetpassword')
  @HttpCode(200)
  resetPassword(@Body() resetData: ResetPasswordDTO) :  Promise< boolean | any > {
    return this.authService.resetPassword(resetData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  @HttpCode(200)
  testUser(@Body() user: ExistingtUserDTO) {
    return { email: user.email}
  }

}
