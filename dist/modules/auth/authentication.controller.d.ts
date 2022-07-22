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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { AuthService } from './authentication.service';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(userObject: RegisterAuthDto): Promise<(import("mongoose").Document<unknown, any, import("mongoose").MergeType<any, Required<{
        _id: any;
    }>>> & Omit<any, "_id"> & Required<{
        _id: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }) | {
        message: import("../configs/enums/enum-auth").MESSAGE_RES;
        statusCode: import("@nestjs/common").HttpStatus;
    }>;
    validateTokenEmail(registerObject: RegisterAuthDto, code: string): Promise<import("@nestjs/common").HttpStatus.NOT_FOUND | {
        status: import("@nestjs/common").HttpStatus;
    }>;
    loginUser(userObjectLogin: LoginAuthDTO): Promise<{
        success: boolean;
        status_code: string;
        access_token: string;
    }>;
    testUser(userObjectLogin: LoginAuthDTO): {
        email: string;
    };
}
