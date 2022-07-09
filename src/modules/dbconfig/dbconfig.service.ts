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

  async checkExistOneInUsers(arg: string) {
    const resp = this.userModel.exists({ email: arg });
    return resp;
  }

  async checkExistInRegisters(arg: string) {
    const resp = this.registerModel.exists({ email: arg });
    return resp;
  }

  async createOneRegister(newUser: any) {
    const created = this.registerModel.create(newUser);
    return created;
  }

  async validateTokenEmail(code: number, mailUser: string) {
    const resp = await this.registerModel.findOne({ email: mailUser });
    if(!resp && !resp.email) return resp.verificationCode == code ? true : false;
    return false;
  }

  async getRegister(emailRegister: string){
    const resp = await this.registerModel.findOne({email: emailRegister});
    return resp;
  }

  async createOneUser(newUser: any) {
    const created = this.userModel.create(newUser);
    return created;
  }
}
