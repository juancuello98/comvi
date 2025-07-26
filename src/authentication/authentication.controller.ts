import { Controller, Post, Body, UseGuards, HttpCode, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './authentication.service';

import { LoginDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';

import { UserDTO } from 'src/models/users/interfaces/user-details.interface';
import { UserValidatedDTO } from 'src/models/users/interfaces/user-validated.interface';
import { RequestResetPasswordDTO } from './dto/request-reset-password-dto';
import { PasswordTokenDTO } from './dto/token-password.dto';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { 
  exLogin, 
  exLoginResponse, 
  exRegisterUser, 
  exRegisterUserResponse, 
  exValidateToken, 
  exValidateTokenResponde,
  exRequestResetPassword,
  exRequestResetPasswordResponse,
  exPasswordToken,
  exPasswordTokenResponse,
  exResetPassword,
  exResetPasswordResponse
} from '../swagger/swagger.mocks';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { ResentVerificationCodeDTO } from './dto/resent.verification.code.dto';

@ApiTags('auth')

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHelper: ResponseHelper
  ) { }

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

  @Post('/passwordtoken/validate')
  @ApiOperation({ summary: 'Validate verification code and generate access token' })
  @ApiBody({
    type: PasswordTokenDTO,
    examples: {
      example1: {
        summary: 'Validate verification code',
        description: 'Enter the verification code received by email',
        value: exPasswordToken
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Code validated and access token generated',
    example: exPasswordTokenResponse
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(200)
  validatePasswordToken(@Body() token: PasswordTokenDTO): Promise<ResponseDTO> {
    return this.authService.validatePasswordToken(token);
  }

  @Post('/requestresetpassword')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({
    type: RequestResetPasswordDTO,
    examples: {
      example1: {
        summary: 'Request password reset',
        description: 'Send verification code to user email',
        value: exRequestResetPassword
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reset password email sent successfully',
    example: exRequestResetPasswordResponse
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(200)
  requestResetPassword(@Body() req: RequestResetPasswordDTO): Promise<ResponseDTO> {
    const { email } = req;
    return this.authService.requestResetPassword(email);
  }

  @Post('/resetpassword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reset password with access token' })
  @ApiBody({
    type: ResetPasswordDTO,
    examples: {
      example1: {
        summary: 'Reset password',
        description: 'Enter new password',
        value: exResetPassword
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successfully',
    example: exResetPasswordResponse
  })
  @ApiResponse({ status: 400, description: 'Invalid access token or validation required' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(200)
  resetPassword(@Body() resetData: ResetPasswordDTO, @Req() request: Request): Promise<ResponseDTO> {
    const user = request.user as any;
    resetData.email = user.email;
    return this.authService.resetPassword(resetData);
  }

  @Post('/resentverification')
  resentVerificationCode(@Body() resentData: ResentVerificationCodeDTO){
    return this.authService.resentVerificationEmail(resentData.email);
  }
}
