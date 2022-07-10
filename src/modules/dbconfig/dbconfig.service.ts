import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RegisterDocument,
  Register,
  UserDocument,
  User,
} from '../dbconfig/schemas';

@Injectable()
export class DbconfigService {
  constructor(
    @InjectModel(Register.name)
    private readonly registerModel: Model<RegisterDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async checkExistOneInUsers(condition: any) {
    const resp = this.userModel.exists(condition);
    return resp;
  }

  async checkExistInRegisters(condition: any) {
    const resp = this.registerModel.exists(condition);
    return resp;
  }

  async createOneRegister(newUser: any) {
    const created = this.registerModel.create(newUser);
    return created;
  }

  async registerFindOne(condition: any) {
    const resp = await this.registerModel.findOne(condition);
    return resp;
  }

  async createOneUser(newUser: any) {
    const created = this.userModel.create(newUser);
    return created;
  }
}
