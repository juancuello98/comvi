import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { UserDetails } from './interfaces/user-details';
import { UserValidated } from './interfaces/user-validated';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    _getUserDetails(user: UserDocument): UserDetails;
    _getUserValidatedOK(user: UserDocument): UserValidated;
    _getUserValidatedFAIL(user: UserDocument): UserValidated;
    findByEmail(email: string): Promise<UserDocument>;
    findById(id: string): Promise<UserDetails | null>;
    create(name: string, email: string, hashedPassword: string, username: string, validated: string, verificationCode: string): Promise<UserDocument>;
    update(user: UserDocument): Promise<UserDocument>;
}
