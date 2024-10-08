//External dependencies
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


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
import { User, UserDocument } from 'src/models/users/user.schema';
import { MailService } from 'src/mail/config.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { UserRepository } from '@/users/user.repository';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { ValidateResult } from './Enum/enum';
import { TripDTO } from '@/trips/dto/existing-trip.dto';
import { get } from 'http';
import { GetUserDTO } from '@/users/dto/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private mailService: MailService,
    private jwtTokenService: JwtService,
    private userRepository: UserRepository,
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

  async register(registerData: Readonly<NewUserDTO>): Promise<ResponseDTO> {
    try{
    const { lastname, name, password: plainPassword, email } = registerData;
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      const message = `El ${email} ya esta en uso.`;
      this.logger.log(message);
      return this.responseHelper.makeResponse(
        true,
        message,
        null,
        HttpStatus.CONFLICT,
      );
    }

    const verificationCode = await this.createVerififyEmailCode();

    await this.mailService.sendCode(email, name, verificationCode);

    this.logger.log(`Se envio la verificacion de email a ${email}.`);

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
    const newUser = await this.userRepository.create(
      user
    );

    const userData = this.userRepository.getUser(newUser);

    return this.responseHelper.makeResponse(
      false,
      'User created.',
      userData,
      HttpStatus.CREATED,
    );

  }

    catch (error) {
      this.logger.error(error.message);
      return this.responseHelper.makeResponse(
        true,
        error.message,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  
  } 
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

  async validate(email: string, password: string): Promise<UserDocument> {

    const user = await this.userRepository.findByEmail(email);

    if (!user ) {
      this.logger.log('User not found.');
      throw ValidateResult.USER_NOT_FOUND;
    }

    if (user.status !== VERIFICATION_CODE_STATUS.VALIDATED) {
      this.logger.log('User not validated.');
      throw ValidateResult.INVALID_STATUS;
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) {
      this.logger.log('Invalid Credentials');
      throw ValidateResult.INVALID_CREDENTIALS;
    }
    return user;
 
}

  async login({ email, password }: LoginDTO): Promise<ResponseDTO> {
    try{
      const user = await this.validate(email, password);

      const userData = this.userRepository.getUser(user);

      const token = this.loginWithCredentials(userData);

      return this.responseHelper.makeResponse(
        false,
        'User found.',
        token,
        HttpStatus.OK,
      );
    } 
    catch (error) {
      switch (error.message) {
        case ValidateResult.USER_NOT_FOUND:
          return this.responseHelper.makeResponse(
            true,
            'El usuario no existe o la contraseña es erronea.',
            null,
            HttpStatus.NO_CONTENT,
          );
          case ValidateResult.INVALID_CREDENTIALS:
            return this.responseHelper.makeResponse(
              true,
              'El usuario no existe o la contraseña es erronea.',
              null,
              HttpStatus.NO_CONTENT,
            );
        case ValidateResult.INVALID_STATUS:
          return this.responseHelper.makeResponse(
            true,
            'El usuario no ha sido validado.',
            null,
            HttpStatus.UNAUTHORIZED,
          );
        default:
          this.logger.error(error.message);
          return this.responseHelper.makeResponse(
            true,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR
          )
      }
    }
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
      const user = await this.userRepository.findByEmail(email);

      if (user.verificationCode !== code)
        throw new HttpException(
          'Invalid or expired code.',
          HttpStatus.CONFLICT,
        );

      user.status = VERIFICATION_CODE_STATUS.VALIDATED;

      await this.userRepository.update(user);

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
    const mail = await this.mailService.sendCodePasswordToken(
      email,
      name,
      token,
    );
    this.logger.log(
      'Se envió el mail de repureracion de contraseña. A:  ' + mail,
    );
  }

  async requestResetPassword(userEmail: string): Promise<ResponseDTO> {
    const email = userEmail;
    const findUser = await this.userRepository.findByEmail(email);

    if (!findUser) {
      this.logger.log('El usuario no existe: ' + email);
      return this.responseHelper.makeResponse(
          true,
          'User not found.',
          null,
          HttpStatus.NOT_FOUND,
        );
    }

    findUser.resetPasswordToken = await this.GenerateToken();

    const updated = await this.userRepository.update(findUser);

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

    return this.responseHelper.makeResponse(
      false,
      'PasswordToken generated.',
      {email:updated.email},
      HttpStatus.OK,
    );
  }

  async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
  ): Promise<ResponseDTO> {
    try {
    const { email } = resetPasswordDTO;
    const { password } = resetPasswordDTO;
    const { passwordToken } = resetPasswordDTO;

    const findUser = await this.userRepository.findByEmail(email);

    if (!findUser) {
      this.logger.log('El usuario no existe: ' + email);
      return this.responseHelper.makeResponse( 
        false,
        'User not found.',
        {email},
        HttpStatus.NOT_FOUND,
      );
    }
    
    if (!passwordToken) {
      this.logger.log('El usuario no tiene un token de recuperación: ' + email);
      return this.responseHelper.makeResponse(
        false,
        'User has no reset token.',
        {email},
        HttpStatus.NOT_ACCEPTABLE,
      );
    }    

    if (findUser.resetPasswordToken.code !== passwordToken) {
      this.logger.log('El token de recuperación no coincide: ' + email);
      return this.responseHelper.makeResponse(
        false,
        'The token does not match.',
        {email},
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    
    if (!findUser.resetPasswordToken.validated){
      this.logger.log('El token de recuperación no ha sido validado: ' + email);
      return this.responseHelper.makeResponse(
        false,
        'The token has not been validated yet.',
        {email},
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }


    findUser.password = await this.hashPassword(password);
      
    const updated = await this.userRepository.update(findUser);
      
    this.logger.log('Se le actualizó la contraseña a: ' + updated.email); //JSON.stringify(updated) subir json?
      
    findUser.resetPasswordToken= null;
      
    return this.responseHelper.makeResponse(
        false,
        'Password reseted.',
        {email:updated.email},
        HttpStatus.OK,
    );


  } catch (error) {
    this.logger.error(error.message);
    return this.responseHelper.makeResponse(
      true,
      error.message,
      null,
      HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  async validatePasswordToken(
    passwordTokenDTO: PasswordTokenDTO,
  ): Promise<ResponseDTO> {
    try{
    const { email, passwordToken } = passwordTokenDTO;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.log('El usuario no existe: ' + email);
      return this.responseHelper.makeResponse(
        false,
        'User not found.',
        email,
        HttpStatus.OK,
      );
    }

    const { id } = user;
    const validated =
      (await this.IsExpired(user.resetPasswordToken)) &&
      (await this.compareResetPasswordCode(passwordToken, user));
    const result = { id, email, validated };

    return this.responseHelper.makeResponse(
      false,
      'Token validated reseted.',
      result,
      HttpStatus.OK,
    );
  }
  catch (error) {
    this.logger.error(error.message);
    return this.responseHelper.makeResponse(
      true,
      error.message,
      null,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  }
}
