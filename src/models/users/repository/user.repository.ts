import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import { IUserRepository, UserData } from '../interfaces/user.repository.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async addToken(mail: string, token: string): Promise<User> {
    const update = { $push: { tokens: token } };
    const user = await this.userModel.findByIdAndUpdate(mail, update, { new: true }).exec();
    return user;
  }

  turnIntoUser(user: any): User {
     const {  email, name, lastname, password,} = user;
     const us = new User();
      us.email = email;
      us.name = name;
      us.lastname = lastname;
      us.password = password;
      return us;
  }

  async findByUsername(username: string): Promise<User> {
     const doc = this.userModel.findOne({ username }).exec();
    return doc ? this.turnIntoUser(doc) : null;
  }
  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const user = this.userModel.updateOne({ _id: id }, { password: newPassword }).exec();
    return user ? true : false;
  }
  async createUser(user: User): Promise<User> {
    const us = this.userModel.create(user);
    return us?  this.turnIntoUser(us) : null;
  }
  async getUserById(id: string): Promise<User> {
    const us = await this.userModel.findById(id).exec(); 
    return us ? this.turnIntoUser(us) : null;
  }
  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user).exec();
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = this.userModel.deleteOne({ _id:id}).exec();
    return user ? true : false;
  }
  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users ? users.map((user) => this.turnIntoUser(user)) : null;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user
  }

  async findById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async create(user: any) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async update(user: User): Promise<User> {
    const userUpdated = await this.userModel.updateOne({ email: user.email }, user);
    return userUpdated ? this.turnIntoUser(user) : null;
  }

  async removeTokenFromArray(userId: string, token: string): Promise<User> {
    const update = { $pull: { tokens: token } };
    const user = await this.userModel.findByIdAndUpdate(userId, update, { new: true }).exec();
    return user;
  }

  async findUsersById(
    usersId: string[],
    fieldsToSelect: string[],
  ): Promise<User[]> {
    const users = await this.userModel
      .find({ _id: { $in: usersId } })
      .select(fieldsToSelect.join(' '));

    return users? users.map((user) => this.turnIntoUser(user)) : null;
  }

  // async createRequest(email: string, id: string) {
  //   const update = { $push: { joinRequests: id } };
  //   const user = await this.userModel.findOneAndUpdate(
  //     { email: email },
  //     update,
  //   );
  //   await this.update(user);
  // }
  getUserData(user:User): UserData{
    const {email, name, lastname} = user;
    const userData: UserData = { email, name, lastname };
    return userData
  }
}
