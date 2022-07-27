//External dependencies
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

//Services
import { MailService } from '../config/mail/config.service';
import { UserService } from '../models/users/user.service';

//DTOs
import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserDetails } from '../models/users/interfaces/user-details';
import { VERIFICATION_CODE_STATUS } from './authentication.enum';
import { UserVerificationDTO } from '../models/users/dto/user-verification.dto';
import { UserValidated } from 'src/models/users/interfaces/user-validated';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  //TODO: Registro del usuario
  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { username, name, password, email } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      this.logger.log('Ya existe en la base de datos: Email ' + email);

      throw new HttpException(
        'Una cuenta con este email ya existe!',
        HttpStatus.CONFLICT,
      );
    }

    this.logger.log('No existe en la base de datos: Email ' + email);

    const verificationCode = await this.generateAndSendEmailCodeVerification();

    await this.mailService.sendCodeVerification(email, name, verificationCode);

    this.logger.log('Email de verificacion enviado. A:  ' + email);

    const validated = VERIFICATION_CODE_STATUS.IN_PROGRESS;

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(
      name,
      email,
      hashedPassword,
      username,
      validated,
      verificationCode.toString(),
    );

    this.logger.log('Usuario creado: User ' + JSON.stringify(newUser));

    return this.userService._getUserDetails(newUser);
  }

  async generateAndSendEmailCodeVerification() {
    return 8080;
  }

  async emailVerificated(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (user.validated !== VERIFICATION_CODE_STATUS.OK) return false;
    return true;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) {
      this.logger.log('El usuario no existe: ' + email);
      return null;
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) 
    {
      this.logger.log('Contraseña incorrecta. Email: ' + email);
      return null;
    }

    const emailVerificated = await this.emailVerificated(email);

    if (!emailVerificated) 
    {
      this.logger.log('Email sin verificar. Email ' + email);
      return null
    };

    return this.userService._getUserDetails(user);
  }

  //TODO: Login del usuario
  async login(
    existingUser: ExistingtUserDTO,
  ): Promise<{ token: string }> | null {

    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user)
      throw new HttpException('Credenciales invalidas!', HttpStatus.UNAUTHORIZED);

    const jwt = await this.jwtService.sign({ user });

    this.logger.log('Login Succesfully. JWT: ' + jwt);

    return { token: jwt };
  }

  async validationCode(verifyUser: UserVerificationDTO) : Promise< UserValidated | any> {

    const {email, code} = verifyUser;
    const user = await this.userService.findByEmail(email);

    if(user.verificationCode.toString() !== code) throw new HttpException('Invalid or expired code.', HttpStatus.CONFLICT);

    this.logger.log('Verificacion de email exitosa. Email: ' + email);

    return this.userService._getUserValidatedOK(user);
  }
}
