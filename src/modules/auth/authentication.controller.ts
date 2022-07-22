import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './authentication.service';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    return this.authService.register(userObject);
  }

  @Post('validate/token/:code')
  validateTokenEmail(@Body() registerObject: RegisterAuthDto, @Param('code') code : string) {
    return this.authService.validationCode(registerObject, code);
  }

  @Post('login')
  loginUser(@Body() userObjectLogin: LoginAuthDTO) {
    return this.authService.login(userObjectLogin);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  testUser(@Body() userObjectLogin: LoginAuthDTO) {
    return { email: userObjectLogin.email}
  }

}
