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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private mailService: MailService,
    private jwtTokenService: JwtService,
    private userService: UserService,
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
    token.code = this.generateRandomString(6);
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

  async createVerififyEmailCode(): Promise<string> {
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

  // async sendEmailPasswordToken(email: string, name: string, token: string) {
  //   const mail = await this.mailService.sendCodePasswordToken(
  //     email,
  //     name,
  //     token,
  //   );
  //   this.logger.log(
  //     'Se envió el mail de repureracion de contraseña. A:  ' + mail,
  //   );
  // }

  // async requestResetPassword(userEmail: string): Promise<boolean | any> {
  //   const email = userEmail;
  //   const findUser = await this.userService.findByEmail(email);

  //   if (!findUser) {
  //     this.logger.log('El usuario no existe: ' + email);
  //     return new HttpException('USER_NOT_FOUND', 404);
  //   }

  //   findUser.resetPasswordToken = await this.GenerateToken();

  //   const updated = await this.userService.update(findUser);

  //   this.logger.log(
  //     'Se le actualizó el código de recuperación de contraseña a ' +
  //       updated.email +
  //       ' codigo ' +
  //       updated.resetPasswordToken.code,
  //   );

  //   await this.sendEmailPasswordToken(
  //     findUser.email,
  //     findUser.name,
  //     findUser.resetPasswordToken.code,
  //   );

  //   this.logger.log(
  //     'Se le envió un mail con el código de recuperación de contraseña a: ' +
  //       email,
  //   );

  //   return {
  //     success: true,
  //     statusCode: 200,
  //   };
  // }

  // async resetPassword(
  //   resetPasswordDTO: ResetPasswordDTO,
  // ): Promise<boolean | any> {
  //   const { email } = resetPasswordDTO;
  //   const { password } = resetPasswordDTO;
  //   const findUser = await this.userService.findByEmail(email);

  //   if (!findUser) {
  //     this.logger.log('El usuario no existe: ' + email);
  //     return new HttpException('USER_NOT_FOUND', 404);
  //   }

  //   findUser.resetPasswordToken = null;

  //   findUser.password = await this.hashPassword(password);

  //   const updated = await this.userService.update(findUser);

  //   this.logger.log('Se le actualizó la contraseña a: ' + updated.email); //JSON.stringify(updated) subir json?

  //   return {
  //     success: true,
  //     statusCode: 200,
  //   };
  // }

  async validatePasswordToken(
    passwordTokenDTO: PasswordTokenDTO,
  ): Promise<UserValidatedDTO | any> {
    const { email, passwordToken } = passwordTokenDTO;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.log('El usuario no existe: ' + email);
      return new HttpException('USER_NOT_FOUND', 404);
    }

    const { id } = user;
    const validate =
      (await this.IsExpired(user.resetPasswordToken)) &&
      (await this.compareResetPasswordCode(passwordToken, user));
    const result = { id, email, validate };

    return result;
  }
}
