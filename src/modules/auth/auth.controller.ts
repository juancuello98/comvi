import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    return this.authService.register(userObject);
  }

  @Post('login')
  loginUser(@Body() userObjectLogin: LoginAuthDTO) {
    return this.authService.login(userObjectLogin);
  }

}
