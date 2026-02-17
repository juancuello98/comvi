import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

/**
 * Repositorio de usuarios - Solo acceso a datos
 * Siempre retorna objetos planos (no Mongoose documents)
 */
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ email })
      .lean() // Retornar objeto plano
      .exec();
    return user as User;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password') // Incluir password
      .lean() // Retornar objeto plano
      .exec();
    return user as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel
      .findById(id)
      .lean() // Retornar objeto plano
      .exec();
    return user as User;
  }

  async create(user: any): Promise<User> {
    const createdUser = await this.userModel.create(user);
    // `create` puede retornar un array, normalizamos a un documento
    const userDoc = Array.isArray(createdUser) ? createdUser[0] : createdUser;
    // Convertir a objeto plano
    return userDoc.toObject() as User;
  }

  async update(user: Partial<User> & { _id: string }): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .lean() // Retornar objeto plano
      .exec();
    return updatedUser as User;
  }

  async findUsersById(
    usersId: string[],
    fieldsToSelect: string[],
  ): Promise<User[]> {
    const users = await this.userModel
      .find({ _id: { $in: usersId } })
      .select(fieldsToSelect.join(' '))
      .lean() // Retornar objetos planos
      .exec();

    return users as User[];
  }

  async createRequest(email: string, id: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate(
        { email },
        { $push: { joinRequests: id } }
      )
      .exec();
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.userModel
      .find({ status: 'VALIDATED' })
      .lean() // Retornar objetos planos
      .exec();
    return users as User[];
  }

  async searchByText(searchTerm: string): Promise<User[]> {
    const users = await this.userModel
      .find({ $text: { $search: searchTerm } })
      .select({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .lean() // Retornar objetos planos
      .exec();
    return users as User[];
  }
}
