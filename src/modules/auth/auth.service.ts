import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash, compare } from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { UsersDocument } from '../users/schema/users.schema';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth-dto';
import { MESSAGE_REQ } from './enums/enum-auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async register(userObject: RegisterAuthDto) {

    const { password } = userObject;
    const hashPass = await hash(password, 10);
    userObject = { ...userObject, password: hashPass };
    const userCreated = await this.userModel.create(userObject);

    return userCreated;
  }

  async login(userObjectLogin: LoginAuthDTO) {

    const { email, password } = userObjectLogin;
    const findUser = await this.userModel.findOne({ email });

    if (!findUser) new HttpException('USER_NOT_FOUND', 404);

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) new HttpException('PASSWORD_INCORRECT', 403);
    
    const data = { success : true , message: MESSAGE_REQ.MESSAGE_200}

    return data;
  }
}
