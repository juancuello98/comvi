import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthFirebaseService } from './auth-firebase.service';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';

@ApiTags('firebase/auth')
@Controller('firebase/auth')
export class AuthFirebaseController {
  constructor(private readonly authService: AuthFirebaseService) {}

  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    console.log('[REGISTER_USER]');
    return this.authService.createUserInFirebaseProject(userObject.email,userObject.password);
  }

  @Post('login')
  loginUser(@Body() userObjectLogin: LoginAuthDTO) {
    return this.authService.loginInFirebase(userObjectLogin.email,userObjectLogin.password);
  }

}
