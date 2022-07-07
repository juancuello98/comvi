/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indizes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { UsersDocument } from '../users/schema/users.schema';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth-dto';
import { MESSAGE_REQ } from './enums/enum-auth';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: Model<UsersDocument>);
    register(userObject: RegisterAuthDto): Promise<Omit<import("mongoose").MergeType<UsersDocument, RegisterAuthDto>, "_id"> & Required<{
        _id: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    login(userObjectLogin: LoginAuthDTO): Promise<{
        success: boolean;
        message: MESSAGE_REQ;
    }>;
}
