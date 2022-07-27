import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../users/user.schema';
import { UserDetails } from './interfaces/user-details';
import { UserValidated } from './interfaces/user-validated';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  _getUserValidatedOK(user: UserDocument): UserValidated {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      validated: true
    };
  }

  _getUserValidatedFAIL(user: UserDocument): UserValidated {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      validated: false
    };
  }


  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
    username: string,
    validated: string,
    verificationCode: string
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      username,
      validated,
      verificationCode,

    });
    return newUser.save();
  }

  async update(
    user: UserDocument
  ): Promise<UserDocument> {
    return user.save();
  }
}
