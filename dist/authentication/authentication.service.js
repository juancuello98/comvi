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
const bcrypt = require("bcrypt");
const config_service_1 = require("../config/mail/config.service");
const user_service_1 = require("../models/users/user.service");
const authentication_enum_1 = require("./authentication.enum");
const passwordToken_schema_1 = require("../models/users/passwordToken.schema");
let AuthService = AuthService_1 = class AuthService {
    constructor(mailService, jwtService, userService) {
        this.mailService = mailService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    generateRandomString(num) {
        return Math.random().toString(36).substring(0, num);
        ;
    }
    async GenerateToken() {
        const token = new passwordToken_schema_1.PasswordToken();
        const auxDate = new Date();
        token.created = auxDate;
        auxDate.setTime(auxDate.getTime() + 60 * 60 * 1000);
        token.expire = auxDate;
        token.code = this.generateRandomString(6);
        return token;
    }
    async IsExpired(token) {
        const auxDate = new Date();
        return auxDate < token.expire ? true : false;
    }
    async compareResetPasswordCode(token, user) {
        return token === user.resetPasswordToken.code ? true : false;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 12);
    }
    async register(user) {
        const { lastname, name, password, email } = user;
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            this.logger.log('Ya existe en la base de datos: Email ' + email);
            throw new common_1.HttpException('Una cuenta con este email ya existe!', common_1.HttpStatus.CONFLICT);
        }
        this.logger.log('No existe en la base de datos: Email ' + email);
        const verificationCode = await this.generateAndSendEmailCodeVerification();
        await this.mailService.sendCodeVerification(email, name, verificationCode);
        this.logger.log('Email de verificacion enviado. A:  ' + email);
        const validated = authentication_enum_1.VERIFICATION_CODE_STATUS.IN_PROGRESS;
        const hashedPassword = await this.hashPassword(password);
        const newUser = await this.userService.create(name, email, hashedPassword, lastname, validated, verificationCode.toString());
        this.logger.log('Usuario creado: User ' + JSON.stringify(newUser));
        return this.userService._getUserDetails(newUser);
    }
    async generateAndSendEmailCodeVerification() {
        return 8080;
    }
    async emailVerificated(email) {
        const user = await this.userService.findByEmail(email);
        if (user.validated !== authentication_enum_1.VERIFICATION_CODE_STATUS.OK)
            return false;
        return true;
    }
    async doesPasswordMatch(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        const doesUserExist = !!user;
        if (!doesUserExist) {
            this.logger.log('El usuario no existe: ' + email);
            return null;
        }
        const doesPasswordMatch = await this.doesPasswordMatch(password, user.password);
        if (!doesPasswordMatch) {
            this.logger.log('Contraseña incorrecta. Email: ' + email);
            return null;
        }
        const emailVerificated = await this.emailVerificated(email);
        if (!emailVerificated) {
            this.logger.log('Email sin verificar. Email ' + email);
            return null;
        }
        ;
        return this.userService._getUserDetails(user);
    }
    async login(existingUser) {
        const { email, password } = existingUser;
        const user = await this.validateUser(email, password);
        if (!user)
            throw new common_1.HttpException('Credenciales invalidas!', common_1.HttpStatus.UNAUTHORIZED);
        const jwt = await this.jwtService.sign({ user });
        this.logger.log('Login Succesfully. JWT: ' + jwt);
        return { token: jwt };
    }
    async validationCode(verifyUser) {
        const { email, code } = verifyUser;
        const user = await this.userService.findByEmail(email);
        if (user.verificationCode.toString() !== code)
            throw new common_1.HttpException('Invalid or expired code.', common_1.HttpStatus.CONFLICT);
        user.validated = authentication_enum_1.VERIFICATION_CODE_STATUS.OK;
        const userValidated = this.userService.update(user);
        this.logger.log('Verificacion de email exitosa. Email: ' + email + '. ESTADO: ' + (await userValidated).validated);
        return this.userService._getUserValidatedOK(user);
    }
    async sendEmailPasswordToken(email, name, token) {
        const mail = await this.mailService.sendCodePasswordToken(email, name, token);
        this.logger.log('Se envió el mail de repureracion de contraseña. A:  ' + mail);
    }
    async requestResetPassword(userEmail) {
        const email = userEmail;
        const findUser = await this.userService.findByEmail(email);
        if (!findUser) {
            this.logger.log('El usuario no existe: ' + email);
            return new common_1.HttpException('USER_NOT_FOUND', 404);
        }
        findUser.resetPasswordToken = await this.GenerateToken();
        const updated = await this.userService.update(findUser);
        this.logger.log('Se le actualizó el código de recuperación de contraseña a ' + updated.email + ' codigo ' + updated.resetPasswordToken.code);
        await this.sendEmailPasswordToken(findUser.email, findUser.name, findUser.resetPasswordToken.code);
        this.logger.log('Se le envió un mail con el código de recuperación de contraseña a: ' + email);
        return {
            success: true,
            statusCode: 200
        };
    }
    async resetPassword(resetPasswordDTO) {
        const { email } = resetPasswordDTO;
        const { password } = resetPasswordDTO;
        const findUser = await this.userService.findByEmail(email);
        if (!findUser) {
            this.logger.log('El usuario no existe: ' + email);
            return new common_1.HttpException('USER_NOT_FOUND', 404);
        }
        findUser.resetPasswordToken = null;
        findUser.password = await this.hashPassword(password);
        const updated = await this.userService.update(findUser);
        this.logger.log('Se le actualizó la contraseña a: ' + updated.email);
        return {
            success: true,
            statusCode: 200
        };
    }
    async validatePasswordToken(passwordTokenDTO) {
        const { email, passwordToken } = passwordTokenDTO;
        const findUser = await this.userService.findByEmail(email);
        if (!findUser) {
            this.logger.log('El usuario no existe: ' + email);
            return new common_1.HttpException('USER_NOT_FOUND', 404);
        }
        return await this.IsExpired(findUser.resetPasswordToken) && await this.compareResetPasswordCode(passwordToken, findUser) ? this.userService._getUserValidatedOK(findUser) : this.userService._getUserValidatedFAIL(findUser);
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.MailService,
        jwt_1.JwtService,
        user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=authentication.service.js.map