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
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';
import { MESSAGE_RES } from '../configs/enums/enum-auth';
import { MongoService } from '../dbconfig/dbconfig.service';
import { MailService } from '../mailer/mail.service';
export declare class AuthService {
    private dbconfig;
    private mailService;
    private jwtService;
    private readonly logger;
    constructor(dbconfig: MongoService, mailService: MailService, jwtService: JwtService);
    register(register: RegisterAuthDto): Promise<(import("mongoose").Document<unknown, any, import("mongoose").MergeType<any, Required<{
        _id: any;
    }>>> & Omit<any, "_id"> & Required<{
        _id: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }) | {
        message: MESSAGE_RES;
        statusCode: HttpStatus;
    }>;
    sendEmailCodeVerification(email: string, name: string, token: number): Promise<void>;
    generateAndSendEmailCodeVerification(): Promise<number>;
    login(userObjectLogin: LoginAuthDTO): Promise<{
        success: boolean;
        status_code: string;
        access_token: string;
    }>;
    validationEmail(emailUser: string): Promise<boolean>;
    validationCode(register: RegisterAuthDto, code: string): Promise<HttpStatus.NOT_FOUND | {
        status: HttpStatus;
    }>;
}
