import { HttpException, HttpStatus, Injectable, Logger, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { hash, compare } from 'bcrypt';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';
import { MESSAGE_RES } from '../configs/enums/enum-auth';
import { MongoService } from '../dbconfig/dbconfig.service';
import { MailService } from '../mailer/mail.service';
import { VERIFICATION_CODE_STATUS } from '../configs/enums/enum-auth';
import { User } from '../configs/entities/entities';
import { UserDocument } from '../dbconfig/schemas';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private dbconfig: MongoService,
    private mailService: MailService,
    private jwtService: JwtService,
    
  ) {}

  //TODO: Registro del usuario
  async register(register: RegisterAuthDto) {
    try {
      const exist = await this.validationEmail(register.email);

      if (!exist) {
        this.logger.log('El usuario %s no existe en la base de datos. ', register.email)

        const userRegister = new User();

        const { password, email, name, lastName, username } = register;

        const hashPass = await hash(password, 10);

        userRegister.password = hashPass;
        userRegister.email = email;
        userRegister.name = name;
        userRegister.lastname = lastName;
        userRegister.username = username;

        userRegister.verificationCode =
          await this.generateAndSendEmailCodeVerification();

        await this.sendEmailCodeVerification(
          userRegister.email,
          userRegister.name,
          userRegister.verificationCode,
        );

        userRegister.validated = VERIFICATION_CODE_STATUS.IN_PROGRESS;

        const userCreated = await this.dbconfig.createOneUser(userRegister);

        return userCreated;
      } else {
        const userAlreadyExist = {
          message: MESSAGE_RES.userAlreadyExist,
          statusCode: HttpStatus.FOUND,
        };

        return userAlreadyExist;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendEmailCodeVerification(email: string, name: string, token: number) {
    const sended = await this.mailService.sendCodeVerification(
      email,
      name,
      token,
    );
    this.logger.log('Email enviado a:', email)
  }

  async generateAndSendEmailCodeVerification() {
    return 8080;
  }

  //TODO: Login del usuario
  async login(userObjectLogin: LoginAuthDTO) {
    const { email, password } = userObjectLogin;
    const findUser = await this.dbconfig.checkExistOneInUsers({ email: email });

    if (!findUser) new HttpException('USER_NOT_FOUND', 404);

    const checkPassword = await compare(password, findUser._id.password, () => {
      return true;
    });

    if (!checkPassword) new HttpException('PASSWORD_INCORRECT', 403);

    if (findUser._id.validated !== VERIFICATION_CODE_STATUS.OK) new HttpException('NO_EMAIL_VALIDATION', 403);

    const data = { username: findUser._id.username, userID: findUser._id._id };

    return {
      success: true,
      status_code: '200',
      access_token: this.jwtService.sign(data),
    };
  }

  //TODO: Verificacion de existencia de Email ya registrado
  async validationEmail(emailUser: string) {
    const findUsersResponse = await this.dbconfig.checkExistOneInUsers({
      email: emailUser,
    });

    if (!findUsersResponse) return false;
    return true;
  }

  async validationCode(register: RegisterAuthDto, code: string) {
    const userCreated: UserDocument =
      await this.dbconfig.userFindOne({ email: register.email });
    const validated = userCreated.verificationCode === parseInt(code)  ? true : false;

    if (validated) 
    {
      await this.dbconfig.updateItem({email: userCreated.email},{validated: VERIFICATION_CODE_STATUS.OK});
      return {status: HttpStatus.OK};
    }

    return HttpStatus.NOT_FOUND
  }
}
