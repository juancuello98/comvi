"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = require("bcrypt");
const enum_auth_1 = require("../configs/enums/enum-auth");
const dbconfig_service_1 = require("../dbconfig/dbconfig.service");
const mail_service_1 = require("../mailer/mail.service");
const enum_auth_2 = require("../configs/enums/enum-auth");
const entities_1 = require("../configs/entities/entities");
let AuthService = AuthService_1 = class AuthService {
    constructor(dbconfig, mailService, jwtService) {
        this.dbconfig = dbconfig;
        this.mailService = mailService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(register) {
        try {
            const exist = await this.validationEmail(register.email);
            if (!exist) {
                this.logger.log('El usuario %s no existe en la base de datos. ', register.email);
                const userRegister = new entities_1.User();
                const { password, email, name, lastName, username } = register;
                const hashPass = await (0, bcrypt_1.hash)(password, 10);
                userRegister.password = hashPass;
                userRegister.email = email;
                userRegister.name = name;
                userRegister.lastname = lastName;
                userRegister.username = username;
                userRegister.verificationCode =
                    await this.generateAndSendEmailCodeVerification();
                await this.sendEmailCodeVerification(userRegister.email, userRegister.name, userRegister.verificationCode);
                userRegister.validated = enum_auth_2.VERIFICATION_CODE_STATUS.IN_PROGRESS;
                const userCreated = await this.dbconfig.createOneUser(userRegister);
                return userCreated;
            }
            else {
                const userAlreadyExist = {
                    message: enum_auth_1.MESSAGE_RES.userAlreadyExist,
                    statusCode: common_1.HttpStatus.FOUND,
                };
                return userAlreadyExist;
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async sendEmailCodeVerification(email, name, token) {
        const sended = await this.mailService.sendCodeVerification(email, name, token);
        this.logger.log('Email enviado a: %s.', email, sended);
    }
    async generateAndSendEmailCodeVerification() {
        return 8080;
    }
    async login(userObjectLogin) {
        const { email, password } = userObjectLogin;
        const findUser = await this.dbconfig.checkExistOneInUsers({ email: email });
        if (!findUser)
            new common_1.HttpException('USER_NOT_FOUND', 404);
        const checkPassword = await (0, bcrypt_1.compare)(password, findUser._id.password, () => {
            return true;
        });
        if (!checkPassword)
            new common_1.HttpException('PASSWORD_INCORRECT', 403);
        if (findUser._id.validated !== enum_auth_2.VERIFICATION_CODE_STATUS.OK)
            new common_1.HttpException('NO_EMAIL_VALIDATION', 403);
        const data = { username: findUser._id.username, userID: findUser._id._id };
        return {
            success: true,
            status_code: '200',
            access_token: this.jwtService.sign(data),
        };
    }
    async validationEmail(emailUser) {
        const findUsersResponse = await this.dbconfig.checkExistOneInUsers({
            email: emailUser,
        });
        if (!findUsersResponse)
            return false;
        return true;
    }
    async validationCode(register, code) {
        const userCreated = await this.dbconfig.userFindOne({ email: register.email });
        const validated = userCreated.verificationCode === parseInt(code) ? true : false;
        if (validated) {
            await this.dbconfig.updateItem({ email: userCreated.email }, { validated: enum_auth_2.VERIFICATION_CODE_STATUS.OK });
            return { status: common_1.HttpStatus.OK };
        }
        return common_1.HttpStatus.NOT_FOUND;
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dbconfig_service_1.MongoService,
        mail_service_1.MailService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=authentication.service.js.map