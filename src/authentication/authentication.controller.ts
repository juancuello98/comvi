import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './authentication.service';

import { LoginDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';

import { UserDTO } from 'src/models/users/interfaces/user-details.interface';
import { UserValidatedDTO } from 'src/models/users/interfaces/user-validated.interface';
import { exLogin, exLoginResponse, exRegisterUser, exRegisterUserResponse, exValidateToken, exValidateTokenResponde } from '../swagger/swagger.mocks';

@ApiTags('auth')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: NewUserDTO, examples: {
      example1: {
        summary: 'Typical user registration',
        description: 'Example of a typical user registration request',
        value: exRegisterUser
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 201, description: 'The user has been successfully registered.', example:
    exRegisterUserResponse
   })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists with this email' })
  register(@Body() user: NewUserDTO): Promise<UserDTO | null> {
    return this.authService.register(user);
  }

  @Post('validate/token')
  @ApiOperation({ summary: 'Validate user email by token' })
  @ApiBody({
    type: UserVerificationDTO, examples: {
      example1: {
        summary: 'Typical user email validation',
        description: 'Example of a typical user email validation',
        value: exValidateToken
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Validation was succesfully.', example:exValidateTokenResponde })
  @HttpCode(200)
  validate(
    @Body() user: UserVerificationDTO,
  ): Promise<UserValidatedDTO | any> {
    return this.authService.verifyEmailCode(user);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login'
  })
  @ApiBody({
    type: LoginDTO, examples: {
      example1: {
        summary: 'Typical user login',
        description: 'Example of a typical user login',
        value: exLogin
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Validation was succesfully.', example:exLoginResponse })
 
  @HttpCode(200)
  login(@Body() user: LoginDTO): Promise<Record<string, string> | null> {
    return this.authService.login(user);
  }

  // TODO: Refactor todo lo que es recuperar contraseña
  // @Post('/passwordtoken/validate')
  // @HttpCode(200)
  // validatePasswordToken(@Body() token: PasswordTokenDTO) :  Promise< UserValidated | any > {
  //   return this.authService.validatePasswordToken(token);
  // }

  // @Post('/requestresetpassword')
  // @HttpCode(200)
  // requestResetPassword(@Body() req: RequestResetPasswordDTO) :  Promise< boolean | any > {
  //   const {email} = req;
  //   return this.authService.requestResetPassword(email);
  // }

  // @Post('/resetpassword')
  // @HttpCode(200)
  // resetPassword(@Body() resetData: ResetPasswordDTO) :  Promise< boolean | any > {
  //   return this.authService.resetPassword(resetData);
  // }
}
