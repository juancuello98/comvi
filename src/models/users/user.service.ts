import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseHelper } from 'src/common/helpers/http/response.helper';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';

import { User, UserDocument } from '../users/user.schema';
import { GetUserDTO } from './dto/user.dto';
import { UserDetails } from './interfaces/user-details.interface';
import { UserValidated } from './interfaces/user-validated.interface';

@Injectable()
export class UserService {
 
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,    
    private readonly responseHelper : ResponseHelper
  ) {}

  _getUserDetails(user: UserDocument){
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };
  }

  _getUserValidatedOK(user: UserDocument): UserValidated {
    return {
      id: user._id,
      email: user.email,
      validated: true
    };
  }

  _getUserValidatedFAIL(user: UserDocument): UserValidated {
    return {
      id: user._id,
      email: user.email,
      validated: false
    };
  }


  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserData(email:string): Promise<ResponseDTO>{
    try {
      const user = await this.findByEmail(email);

      if(!user){
        return this.responseHelper.makeResponse(false,'User not found.',null,HttpStatus.NOT_FOUND);
      }

      const userData = {
        name : user.name,
        lastname : user.lastname,
        email : user.email,
        trips : user.trips,
        packages : user.packages,
        tripsFavourites : user.tripsFavourites,
        subscribedTrips : user.subscribedTrips,
        tripsCreated : user.tripsCreated,
        joinRequests : user.joinRequests
      } as GetUserDTO
      
      return this.responseHelper.makeResponse(false,'User data successfully found.',userData,HttpStatus.OK);
    } catch (error) {
      return this.responseHelper.makeResponse(true,'Error recovering user data.',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    lastname: string,
    validated: string,
    verificationCode: string
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      lastname,
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
