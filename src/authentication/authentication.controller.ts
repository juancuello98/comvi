import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './authentication.service';

import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';

import { UserDetails } from 'src/models/users/interfaces/user-details';
import { UserValidated } from 'src/models/users/interfaces/user-validated';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: NewUserDTO): Promise< UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('validate/token')
  validateTokenEmail(@Body() user: UserVerificationDTO) :  Promise< UserValidated | any > {
    return this.authService.validationCode(user);
  }

  @Post('login')
  loginUser(@Body() user: ExistingtUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  testUser(@Body() user: ExistingtUserDTO) {
    return { email: user.email}
  }

}
