import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash, compare } from 'bcrypt';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';
import { MESSAGE_RES } from '../configs/enums/enum-auth';
import { DbconfigService } from '../dbconfig/dbconfig.service';
import { MailService } from '../mailer/mail.service';
import { VERIFICATION_CODE_STATUS } from '../configs/enums/enum-auth';
import { User } from '../configs/entities/entities';

@Injectable()
export class AuthService {
  constructor(
    private dbconfig: DbconfigService,
    private mailService: MailService,
  ) {}

  //TODO: Registro del usuario
  async register(register: RegisterAuthDto) {
    try {
      const exist = await this.validationEmail(register.email);

      console.log('exist', exist);

      if (!exist) {
        const { password } = register;

        const hashPass = await hash(password, 10);

        register = { ...register, password: hashPass };

        register.verificationCode =
          await this.generateAndSendEmailCodeVerification();

        await this.sendEmailCodeVerification(
          register.email,
          register.name,
          register.verificationCode,
        );

        register.statusVerification = VERIFICATION_CODE_STATUS.IN_PROGRESS;
        const registerCreated = await this.dbconfig.createOneRegister(register);

        return registerCreated;
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
    console.log('Email Sended: ', sended);
  }

  async generateAndSendEmailCodeVerification() {
    return 8080;
  }

  //TODO: Login del usuario
  async login(userObjectLogin: LoginAuthDTO) {
    const { email } = userObjectLogin;
    const findUser = await this.dbconfig.checkExistOneInUsers(email);

    if (!findUser) new HttpException('USER_NOT_FOUND', 404);

    //const checkPassword = await compare(password, findUser?.password);

    //if (!checkPassword) new HttpException('PASSWORD_INCORRECT', 403);

    const data = { success: true, message: '200' };

    return data;
  }

  //TODO: Verificacion de Email
  async validationEmail(emailUser: string) {
    const findUsersResponse = await this.dbconfig.checkExistOneInUsers(
      emailUser,
    );
    const findeRegisterResponse = await this.dbconfig.checkExistInRegisters(
      emailUser,
    );

    if (!findUsersResponse && !findeRegisterResponse) return false;
    return true;
  }

  async validationCode(register: RegisterAuthDto) {
    const validated = await this.dbconfig.validateTokenEmail(register.verificationCode,
      register.email,
    );

    if(validated){
      // Aca falta actualizar el register en VERIFICADO cuando es valido, y eliminar el codigo que tiene , desp traer los datos para armar el usuario
      const registerCreated = await this.dbconfig.getRegister(register.email)

      const newUser = new User();

      newUser.username = registerCreated.username;
      newUser.name = registerCreated.name;
      newUser.password = registerCreated.password;
      newUser.email = registerCreated.email;

      const userCreated = await this.dbconfig.createOneUser(newUser);
      return userCreated;

    }

    const userAlreadyExist = {
      message: MESSAGE_RES.invalid_code,
      statusCode: HttpStatus.NOT_FOUND,
    };

    return userAlreadyExist;


  }
}
