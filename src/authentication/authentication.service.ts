//External dependencies
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

//Services
import { UserService } from '../models/users/user.service';

//DTOs
import { LoginDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserDTO } from '../models/users/interfaces/user-details.interface';
import { VERIFICATION_CODE_STATUS } from './authentication.enum';
import { UserVerificationDTO } from '../models/users/dto/user-verification.dto';
import { UserValidatedDTO } from 'src/models/users/interfaces/user-validated.interface';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { PasswordTokenDTO } from './dto/token-password.dto';
import { PasswordToken } from '../models/users/passwordToken.schema';
import { UserDocument } from 'src/models/users/user.schema';
import { MailService } from 'src/mail/config.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { helpers } from 'handlebars';
import { ResponseHelper } from '@/helpers/http/response.helper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private mailService: MailService,
    private jwtTokenService: JwtService,
    private userService: UserService,
    private responseHelper: ResponseHelper
  ) {}

  generateRandomString(num) {
    return Math.random()
      .toString(36)
      .substring(0, num)
      .toUpperCase()
      .replace('.', '');
  }

  async GenerateToken(): Promise<PasswordToken> {
    const token = new PasswordToken();
    token.created = new Date();
    token.expire = new Date(token.created.getTime() + 2 * 60 * 60000);
    token.code = await this.createVerififyEmailCode();
    token.validated = false;
    return token;
  }

  async IsExpired(token: PasswordToken) {
    const auxDate = new Date();
    return auxDate < token.expire ? true : false;
  }

  async compareResetPasswordCode(token: string, user: UserDocument) {
    return token === user.resetPasswordToken.code ? true : false;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(registerData: Readonly<NewUserDTO>): Promise<UserDTO | any> {
    const { lastname, name, password: plainPassword, email } = registerData;
    const userExists = await this.userService.findByEmail(email);
    const isVerified = userExists.status === VERIFICATION_CODE_STATUS.VALIDATED;
    if(!isVerified) {
      const message = `USER_NOT_VALIDATED ${email}.`;
      this.logger.log(message);

      throw new HttpException(
        message,
        HttpStatus.CONFLICT,
      );
    }

    if (userExists) {
      const message = `User already exists with this email ${email}.`;
      this.logger.log(message);

      throw new HttpException(
        message,
        HttpStatus.CONFLICT,
      );
    }

    const verificationCode = await this.createVerififyEmailCode();

    await this.mailService.sendCode(email, name, verificationCode);

    this.logger.log(`Verification email sent to ${email}.`);

    const status = VERIFICATION_CODE_STATUS.IN_PROGRESS;

    const password = await this.hashPassword(plainPassword);
    const user : CreateUserDto = {
      name,
      email,
      password,
      lastname,
      status,
      verificationCode
    }
    const newUser = await this.userService.create(
      user
    );

    return this.userService.getUser(newUser);
  }

  async resentVerificationEmail(email: string){
    const userExists = await this.userService.findByEmail(email);
    if (!userExists) {
      this.logger.log(`User not found with email: ${email}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const verificationCode = this.createVerififyEmailCode();
    userExists.verificationCode = verificationCode;
    await this.userService.update(userExists);
    await this.mailService.sendCode(email, userExists.name, verificationCode);
    return this.responseHelper.makeResponse(false,'Verification email resent successfully.',null,HttpStatus.OK);
  }

  createVerififyEmailCode(): string {
    return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validate(email: string, password: string): Promise<UserDTO | null> {
    const user = await this.userService.findByEmail(email);

    if (!user || user.status !== VERIFICATION_CODE_STATUS.VALIDATED) {
      this.logger.log('User not found or email not validated.');
      return null;
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) {
      this.logger.log('Invalid Credentials');
      return null;
    }

    return this.userService.getUser(user);
  }

  async login({ email, password }: LoginDTO): Promise<Record<string, string>> {
    const user = await this.validate(email, password);

    if (!user)
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);

    const token = this.loginWithCredentials(user);

    return token;
  }

  async loginWithCredentials(user: UserDTO) {
    const payload = { user };

    return {
      token: this.jwtTokenService.sign(payload),
    };
  }

  async verifyEmailCode({
    email,
    code,
  }: UserVerificationDTO): Promise<ResponseDTO> {
    try {
      const user = await this.userService.findByEmail(email);

      if (user.verificationCode !== code)
        throw new HttpException(
          'Invalid or expired code.',
          HttpStatus.CONFLICT,
        );

      user.status = VERIFICATION_CODE_STATUS.VALIDATED;

      await this.userService.update(user);

      const response : ResponseDTO = {
        hasError: false,
        message: 'Validation was succesfully.',
        data: true,
        status: HttpStatus.OK
      }
      return response;
    } catch (error) {
      this.logger.error(error.message);
      const response : ResponseDTO = {
        hasError: true,
        message: `Validation Error: ${error.message}.`,
        data: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
      return response;
    }
  }

  //TODO: Refactor de todo lo que es reestrablecer contraseña

  async sendEmailPasswordToken(email: string, name: string, token: string) {
    await this.mailService.sendCodePasswordToken(
      email,
      name,
      token,
    );
    this.logger.log(
      'Se envió el mail de recuperación de contraseña a: ' + email,
    );
  }

  async requestResetPassword(userEmail: string): Promise<ResponseDTO> {
    const email = userEmail;
    const findUser = await this.userService.findByEmail(email);

    if (!findUser) {
      this.logger.log('El usuario no existe: ' + email);
      return {
        hasError: true,
        message: 'User not found',
        data: null,
        status: HttpStatus.NOT_FOUND
      };
    }

    findUser.resetPasswordToken = await this.GenerateToken();

    const updated = await this.userService.update(findUser);

    if (!updated || !updated.resetPasswordToken || !updated.resetPasswordToken.code) {
      this.logger.error('Error: No se pudo generar el token de reset password para: ' + email);
      return {
        hasError: true,
        message: 'Error generating reset password token',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }

    this.logger.log(
      'Se le actualizó el código de recuperación de contraseña a ' +
        updated.email +
        ' codigo ' +
        updated.resetPasswordToken.code,
    );

    await this.sendEmailPasswordToken(
      findUser.email,
      findUser.name,
      findUser.resetPasswordToken.code,
    );

    this.logger.log(
      'Se le envió un mail con el código de recuperación de contraseña a: ' +
        email,
    );

    return {
      hasError: false,
      message: 'Reset password email sent successfully',
      data: { email: updated.email },
      status: HttpStatus.OK
    };
  }

  async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
  ): Promise<ResponseDTO> {
    const { email } = resetPasswordDTO;
    const { password } = resetPasswordDTO;
    
    const findUser = await this.userService.findByEmail(email);

    if (!findUser) {
      this.logger.log('El usuario no existe: ' + email);
      return {
        hasError: true,
        message: 'User not found',
        data: null,
        status: HttpStatus.NOT_FOUND
      };
    }

    if (!findUser.resetPasswordToken) {
      this.logger.log('El usuario no tiene código de recuperación: ' + email);
      return {
        hasError: true,
        message: 'User has no reset password code',
        data: null,
        status: HttpStatus.BAD_REQUEST
      };
    }

    if (!findUser.resetPasswordToken.validated) {
      this.logger.log('El usuario no ha validado su código de recuperación: ' + email);
      return {
        hasError: true,
        message: 'User has not validated his verification code',
        data: null,
        status: HttpStatus.BAD_REQUEST
      };
    }

    findUser.password = await this.hashPassword(password);
    findUser.resetPasswordToken = null;

    const updated = await this.userService.update(findUser);

    this.logger.log('Se le actualizó la contraseña a: ' + updated.email);

    return {
      hasError: false,
      message: 'Password reset successfully',
      data: { email: updated.email },
      status: HttpStatus.OK
    };
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const findUser = await this.userService.findByEmail(email);

    if (!findUser) {
      this.logger.log('El usuario no existe: ' + email);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      currentPassword,
      findUser.password,
    );

    if (!doesPasswordMatch) {
      this.logger.log('La contraseña actual no coincide: ' + email);
      throw new HttpException('Current password does not match', HttpStatus.BAD_REQUEST);
    }

    findUser.password = await this.hashPassword(newPassword);
    const updated = await this.userService.update(findUser);

    this.logger.log('Se le actualizó la contraseña a: ' + updated.email);

    return true;
  }

  async validatePasswordToken(
    passwordTokenDTO: PasswordTokenDTO,
  ): Promise<ResponseDTO> {
    const { email, passwordToken } = passwordTokenDTO;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.log('El usuario no existe: ' + email);
      return {
        hasError: true,
        message: 'User not found',
        data: null,
        status: HttpStatus.NOT_FOUND
      };
    }

    if (!user.resetPasswordToken) {
      this.logger.log('El usuario no tiene código de recuperación: ' + email);
      return {
        hasError: true,
        message: 'User has no reset password code',
        data: null,
        status: HttpStatus.BAD_REQUEST
      };
    }

    const isNotExpired = await this.IsExpired(user.resetPasswordToken);
    const codeMatches = await this.compareResetPasswordCode(passwordToken, user);
    const validated = isNotExpired && codeMatches;

    if (!validated) {
      this.logger.log('Código de verificación inválido o expirado: ' + email);
      return {
        hasError: true,
        message: 'Invalid or expired verification code',
        data: null,
        status: HttpStatus.BAD_REQUEST
      };
    }

    user.resetPasswordToken.validated = true;
    await this.userService.update(user);

    const accessToken = this.jwtTokenService.sign(
      { 
        email: user.email, 
        purpose: 'password_reset'
      },
      { expiresIn: '15m' }
    );

    this.logger.log('Código validado y token de acceso generado para: ' + email);

    return {
      hasError: false,
      message: 'Code validated and access token generated',
      data: { accessToken, email },
      status: HttpStatus.OK
    };
  }
}
