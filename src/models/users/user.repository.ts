import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
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
}
