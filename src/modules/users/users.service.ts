import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../configs/DTOs/create-user.dto';
import { UpdateUserDto } from '../configs/DTOs/update-user.dto';
import { User, UserDocument } from '../dbconfig/schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModule: Model<UserDocument>)
  {

  };

  async create(createUserDto: CreateUserDto) {
    const userCreated = await this.usersModule.create(createUserDto);
    return userCreated ;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
