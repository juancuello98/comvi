import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { UserDTO } from './interfaces/user-details.interface';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';
export declare class UserService {
    private readonly userRepository;
    private readonly responseHelper;
    constructor(userRepository: UserRepository, responseHelper: ResponseHelper);
    update(user: UserDocument): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument>;
    getUser({ id, name, lastname, email }: UserDocument): {
        id: any;
        name: string;
        lastname: string;
        email: string;
    };
    getUserData(email: string): Promise<ResponseDTO>;
    findById(id: string): Promise<UserDTO | null>;
    create(name: string, email: string, hashedPassword: string, lastname: string, validated: string, verificationCode: string): Promise<UserDocument>;
    updateUserRequests(email: string, requestId: string): Promise<void>;
    getUsers(ids: string[]): Promise<UserDocument[]>;
}
