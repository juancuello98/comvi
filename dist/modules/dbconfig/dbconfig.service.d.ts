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
import { Document, Model } from 'mongoose';
import { UserDocument, User } from '../dbconfig/schemas';
import { IdbconfigService } from './dbconfig.interface';
export declare class MongoService implements IdbconfigService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    updateItem(condition: Object, value: Object): Promise<User & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    checkExistOneInUsers(condition: any): Promise<Pick<Document<UserDocument, any, any>, "_id">>;
    userFindOne(condition: any): Promise<User & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createOneUser(newUser: any): Promise<Document<unknown, any, import("mongoose").MergeType<any, Required<{
        _id: any;
    }>>> & Omit<any, "_id"> & Required<{
        _id: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export declare class TypeOrmService implements IdbconfigService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    updateItem(value: Object, condition: Object): void;
    checkExistOneInUsers(condition: any): Promise<Pick<Document<UserDocument, any, any>, "_id">>;
    userFindOne(condition: any): Promise<User & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createOneUser(newUser: any): Promise<Document<unknown, any, import("mongoose").MergeType<any, Required<{
        _id: any;
    }>>> & Omit<any, "_id"> & Required<{
        _id: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
