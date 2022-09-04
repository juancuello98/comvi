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
/// <reference types="mongoose/types/indexes" />
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
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
import { Location } from '../locations/location.schema';
import { Package } from '../packages/package.schema';
import { Request } from '../requests/request.schema';
import { Trip } from '../trips/trip.schema';
import { PasswordToken } from '../passwordToken/passwordToken.schema';
export declare type UserDocument = User & Document;
export declare class User {
    username: string;
    name: string;
    email: string;
    password: string;
    validated: string;
    verificationCode: number;
    trips: Trip[];
    locations: Location[];
    packages: Package[];
    tripsFavourites: Trip[];
    subscribedTrips: Trip[];
    tripsCreated: Trip[];
    joinRequests: Request[];
    resetPasswordToken: PasswordToken;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, any>, {}, {}, {}, {}, "type", User>;
