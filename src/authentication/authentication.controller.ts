import { Controller, Post, Body, UseGuards, HttpCode,Request, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './authentication.service';

import { LoginDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';

import { UserDTO } from 'src/models/users/interfaces/user-details.interface';
import { UserValidatedDTO } from 'src/models/users/interfaces/user-validated.interface';
import { exChangePasswordResponseBad, exChangePasswordResponseNotFound, exChangePasswordResponseOK, exLogin, exLoginResponse, exPasswordToken, exRegisterUser, exRegisterUserResponse, exRequestResetPassword, exRequestResetPasswordResponse, exResetPassword, exValidatePasswordToken, exValidateToken ,exValidateTokenResponse } from '../swagger/swagger.mocks';
import { RequestResetPasswordDTO } from './dto/request-reset-password-dto';
import { PasswordTokenDTO } from './dto/token-password.dto';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@ApiTags('auth')

@Controller('auth')
export class AuthController {
  requestHelper: any;
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
  register(@Body() user: NewUserDTO): Promise<ResponseDTO> {
    return this.authService.register(user);
  }

  @Post('validate/token')
  @ApiOperation({ summary: 'Validate user by token' })
  @ApiBody({
    type: UserVerificationDTO, examples: {
      example1: {
        summary: 'Typical user validation',
        description: 'Example of a typical user validation by code request',
        value: exValidateToken
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Validation was succesfully.', example:exValidateTokenResponse })
  @HttpCode(200)
  validate(
    @Body() user: UserVerificationDTO,
  ): Promise<ResponseDTO> {
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
  login(@Body() user: LoginDTO): Promise<ResponseDTO> {
    return this.authService.login(user);
  }

  @Post('/passwordtoken/validate')
  @ApiOperation({ summary: 'Validate password' })
  @ApiBody({
    type: PasswordTokenDTO, examples: {
      example1: {
        summary: 'Typical user validation',
        description: 'Example of a typical user login',
        value: exPasswordToken
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Validation was succesfully.', example:exValidatePasswordToken })
  
  @HttpCode(200)
  validatePasswordToken( @Body() token: PasswordTokenDTO) :  Promise< ResponseDTO > {
    return this.authService.validatePasswordToken(token);
  }

  @Post('/requestresetpassword')
  @ApiOperation({ summary: 'Send the code to reset the password of the user' })
  @ApiBody({
    type: RequestResetPasswordDTO, examples: {
      example1: {
        summary: 'Typical code and email request',
        description: 'Example of a typical code and email request',
        value: exRequestResetPassword
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Validation was succesfully.', example:exRequestResetPasswordResponse })
  @HttpCode(200)
  requestResetPassword( @Body() reqDTO: RequestResetPasswordDTO) :  Promise< ResponseDTO > {
    const {email} = reqDTO;
    return this.authService.requestResetPassword(email);
  }
  
  @Post('/resetpassword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change your password while logged' })
  @ApiBody({
    type: ResetPasswordDTO, examples: {
      example1: {
        summary: 'Typical user password change',
        description: 'Example of a typical change pass request',
        value: exRegisterUser
      }
    }
  }) // Información del cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Password was changed.', example:exChangePasswordResponseOK })
  @ApiResponse({ status: 400, description: 'The password was wrong.', example:exChangePasswordResponseBad })
  @ApiResponse({ status: 404, description: 'The user not exist.', example:exChangePasswordResponseNotFound })
 
  resetPassword(@Body() resetData: ResetPasswordDTO, @Req() request: Request) :  Promise<ResponseDTO> {
    const email = this.requestHelper.getPayload(request);
    resetData.email = email;	
    return this.authService.resetPassword(resetData);
  }
}
