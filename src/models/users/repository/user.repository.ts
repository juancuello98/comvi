import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import { IUserRepository, UserData } from '../interfaces/user.repository.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const user = this.userModel.updateOne({ _id: id }, { password: newPassword }).exec();
    return user ? true : false;
  }
  async createUser(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }
  async getUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec(); 
  }
  async updateUser(id: string, user: Partial<User>): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, user).exec();
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = this.userModel.deleteOne({ _id:id}).exec();
    return user ? true : false;
  }
  getAllUsers(): Promise<UserDocument[]> {
    return  this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
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

  async update(user: UserDocument): Promise<UserDocument> {
    return await user.save();
  }

  async findUsersById(
    usersId: string[],
    fieldsToSelect: string[],
  ): Promise<UserDocument[]> {
    const users = await this.userModel
      .find({ _id: { $in: usersId } })
      .select(fieldsToSelect.join(' '));

    return users;
  }

  async createRequest(email: string, id: string) {
    const update = { $push: { joinRequests: id } };
    const user = await this.userModel.findOneAndUpdate(
      { email: email },
      update,
    );
    await this.update(user);
  }
  getUserData(user:UserDocument): UserData{
    const {id, email, name, lastname} = user;
    const userData: UserData = {  id, email, name, lastname };
    return userData
  }
}
