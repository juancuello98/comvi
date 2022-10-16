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
import { UserDetails } from '../models/users/interfaces/user-details.interface';
import { VERIFICATION_CODE_STATUS } from './authentication.enum';
import { UserVerificationDTO } from '../models/users/dto/user-verification.dto';
import { UserValidated } from 'src/models/users/interfaces/user-validated.interface';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { PasswordTokenDTO } from './dto/token-password.dto';
import { PasswordToken } from '../models/users/passwordToken.schema';
import { UserDocument } from 'src/models/users/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  
  generateRandomString(num) {
    return Math.random().toString(36).substring(0,num); ;
  }

  async GenerateToken() : Promise<PasswordToken> {
    const token = new PasswordToken();
    const auxDate = new Date();
    token.created = auxDate;
    auxDate.setTime(auxDate.getTime()+60*60*1000);
    token.expire = auxDate; 
    token.code = this.generateRandomString(6);
    return token;
  }

  async IsExpired(token: PasswordToken){
    const auxDate = new Date();
    return auxDate < token.expire ? true : false;
  }

  async compareResetPasswordCode (token: string, user : UserDocument) {
    return token === user.resetPasswordToken.code ? true : false;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  //TODO: Registro del usuario
  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { lastname, name, password, email } = user;

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
      lastname,
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

    user.validated = VERIFICATION_CODE_STATUS.OK;
    const userValidated = this.userService.update(user);

    this.logger.log('Verificacion de email exitosa. Email: ' + email + '. ESTADO: ' + (await userValidated).validated);

    return this.userService._getUserValidatedOK(user);
  }

  async sendEmailPasswordToken(email: string, name: string, token: string) {
    const mail = await this.mailService.sendCodePasswordToken(
      email,
      name,
      token,
    );
    this.logger.log('Se envió el mail de repureracion de contraseña. A:  ' + mail);
  }
  
  async requestResetPassword(userEmail :string) : Promise < boolean | any > {
    const email  = userEmail;
    const findUser = await this.userService.findByEmail(email ); 
         
    if (!findUser) 
    {
      this.logger.log('El usuario no existe: ' + email);
      return new HttpException('USER_NOT_FOUND', 404);
    }

    findUser.resetPasswordToken = await this.GenerateToken();
    
    const updated = await this.userService.update(findUser)
    
    this.logger.log('Se le actualizó el código de recuperación de contraseña a ' + updated.email + ' codigo ' + updated.resetPasswordToken.code );

    await this.sendEmailPasswordToken(
      findUser.email,
      findUser.name,
      findUser.resetPasswordToken.code,
    );

    this.logger.log('Se le envió un mail con el código de recuperación de contraseña a: ' + email);
    
    return {
      success: true,
      statusCode: 200
    };
  }
  
  async resetPassword(resetPasswordDTO :ResetPasswordDTO) : Promise < boolean | any > {
    const { email } = resetPasswordDTO;
    const {password} =  resetPasswordDTO;
    const findUser = await this.userService.findByEmail(email); 
         
    if (!findUser) 
    {
      this.logger.log('El usuario no existe: ' + email);
      return new HttpException('USER_NOT_FOUND', 404);
    }

    findUser.resetPasswordToken = null;

    findUser.password = await this.hashPassword(password);
    
    const updated = await this.userService.update(findUser);
    
    this.logger.log('Se le actualizó la contraseña a: ' + updated.email); //JSON.stringify(updated) subir json?
    
    return {
      success: true,
      statusCode: 200
    };
  }
  
  async validatePasswordToken(passwordTokenDTO: PasswordTokenDTO ) : Promise < UserValidated | any >{
    const { email , passwordToken} = passwordTokenDTO;
    const findUser = await this.userService.findByEmail(email); 

    if (!findUser) 
    {
      this.logger.log('El usuario no existe: ' + email);
      return new HttpException('USER_NOT_FOUND', 404);
    }

    return await this.IsExpired(findUser.resetPasswordToken) && await this.compareResetPasswordCode(passwordToken, findUser)? this.userService._getUserValidatedOK(findUser) : this.userService._getUserValidatedFAIL(findUser);
  }
}