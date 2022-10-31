import { Model } from 'mongoose';
import { ResponseHelper } from 'src/common/helpers/http/response.helper';
import { UserDocument } from '../users/user.schema';
import { UserDetails } from './interfaces/user-details.interface';
import { UserValidated } from './interfaces/user-validated.interface';
export declare class UserService {
    private readonly userModel;
    private readonly responseHelper;
    constructor(userModel: Model<UserDocument>, responseHelper: ResponseHelper);
    _getUserDetails(user: UserDocument): UserDetails;
    _getUserValidatedOK(user: UserDocument): UserValidated;
    _getUserValidatedFAIL(user: UserDocument): UserValidated;
    findByEmail(email: string): Promise<UserDocument>;
    findById(id: string): Promise<UserDetails | null>;
    create(name: string, email: string, hashedPassword: string, lastname: string, validated: string, verificationCode: string): Promise<UserDocument>;
    update(user: UserDocument): Promise<UserDocument>;
}
