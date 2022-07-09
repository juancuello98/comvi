import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './authentication.service';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    console.log('[REGISTER_USER]');
    return this.authService.register(userObject);
  }

  @Post('validate/token')
  validateTokenEmail(@Body() registerObject: RegisterAuthDto) {
    console.log('[VALIDATE_TOKEN_EMAIL]');
    return this.authService.validationCode(registerObject);
  }

  @Post('login')
  loginUser(@Body() userObjectLogin: LoginAuthDTO) {
    return this.authService.login(userObjectLogin);
  }

}
