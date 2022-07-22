import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import {
  UserDocument,
  User,
} from '../dbconfig/schemas';
import { IdbconfigService } from './dbconfig.interface';

@Injectable()
export class MongoService implements IdbconfigService{

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async updateItem(condition: Object, value: Object ){
    
    const document_updated = this.userModel.findOneAndUpdate(condition , value);
    return document_updated;
  }

  async checkExistOneInUsers(condition: any) {
    const resp = this.userModel.exists(condition);
    return resp;
  }

  async userFindOne(condition: any) {
    const resp = await this.userModel.findOne(condition);
    return resp;
  }

  async createOneUser(newUser: any) {
    const created = this.userModel.create(newUser);
    return created;
  }
}

@Injectable()
export class TypeOrmService implements IdbconfigService{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  updateItem(value: Object, condition: Object) {
    throw new Error('Method not implemented.');
  }

  async checkExistOneInUsers(condition: any) {
    const resp = this.userModel.exists(condition);
    return resp;
  }

  async userFindOne(condition: any) {
    const resp = await this.userModel.findOne(condition);
    return resp;
  }

  async createOneUser(newUser: any) {
    const created = this.userModel.create(newUser);
    return created;
  }
}