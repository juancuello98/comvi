import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseHelper } from 'src/common/helpers/http/response.helper';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { UserDocument } from '../users/user.schema';
import { GetUserDTO } from './dto/user.dto';
import { UserDTO } from './interfaces/user-details.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly responseHelper: ResponseHelper,
  ) {}

  getUser({ id, name, lastname, email }: UserDocument) {
    return {
      id,
      name,
      lastname,
      email,
    };
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
        lastname,
        trips,
        packages,
        tripsFavourites,
        subscribedTrips,
        tripsCreated,
        joinRequests,
      } = user;

      const userData: GetUserDTO = {
        name,
        lastname,
        email,
        trips,
        packages,
        tripsFavourites,
        subscribedTrips,
        tripsCreated,
        joinRequests,
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
    return this.getUser(user);
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
    lastname: string,
    validated: string,
    verificationCode: string,
  ): Promise<UserDocument> {
    const user = {
      name,
      email,
      hashedPassword,
      lastname,
      validated,
      verificationCode,
    };

    return this.userRepository.create(user);
  }

  
  async updateUserRequests(email: string, requestId: string) {
    await this.userRepository.createRequest(email, requestId);
  }
}
