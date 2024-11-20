import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GetUserDTO } from './dto/user.dto';
import { UserDTO } from './interfaces/user-details.interface';
import { UserRepository } from './repository/user.repository';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async update(user: User): Promise<User> {
    return this.userRepository.update(user)
  }
  
  async findByEmail(email: string): Promise<User> {
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


  async create(
 user : CreateUserDto,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  // async updateUserRequests(email: string, requestId: string) {
  //   await this.userRepository.createRequest(email, requestId);
  // }

  async getUsers(ids: string[]) {
    const users = this.userRepository.findUsersById(ids, [
      'name',
      'lastName',
      'email',
    ]);
    return users;
  }
}
