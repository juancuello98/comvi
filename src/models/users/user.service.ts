import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GetUserDTO } from './dto/user.dto';
import { UserDTO } from './interfaces/user-details.interface';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async update(user: UserDocument) {
    return this.userRepository.update(user)
  }
  
  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
  
  async getUserData(email: string): Promise<ResponseDTO> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return this.responseHelper.makeResponse(
          false,
          'User not found.',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        name,
        lastname
      } = user;

      const userData: GetUserDTO = {
        name,
        lastname,
        email,
      };

      return this.responseHelper.makeResponse(
        false,
        'User data successfully found.',
        userData,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseHelper.makeResponse(
        true,
        'Error recovering user data.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return this.userRepository.getUser(user);
  }

  async create(
 user : CreateUserDto,
  ): Promise<UserDocument> {
    return this.userRepository.create(user);
  }

  async updateUserRequests(email: string, requestId: string) {
    await this.userRepository.createRequest(email, requestId);
  }

  async getUsers(ids: string[]) {
    const users = this.userRepository.findUsersById(ids, [
      'name',
      'lastName',
      'email',
    ]);
    return users;
  }
}
