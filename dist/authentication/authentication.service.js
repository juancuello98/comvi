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
const user_service_1 = require("../models/users/user.service");
const authentication_enum_1 = require("./authentication.enum");
const passwordToken_schema_1 = require("../models/users/passwordToken.schema");
const config_service_1 = require("../mail/config.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(mailService, jwtTokenService, userService) {
        this.mailService = mailService;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    generateRandomString(num) {
        return Math.random()
            .toString(36)
            .substring(0, num)
            .toUpperCase()
            .replace('.', '');
    }
    async GenerateToken() {
        const token = new passwordToken_schema_1.PasswordToken();
        token.created = new Date();
        token.expire = new Date(token.created.getTime() + 2 * 60 * 60000);
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
    async register(registerData) {
        const { lastname, name, password, email } = registerData;
        const userExists = await this.userService.findByEmail(email);
        if (userExists) {
            this.logger.log('El usuario existe en la base de datos: Email ' + email);
            throw new common_1.HttpException('Una cuenta con este email ya existe.', common_1.HttpStatus.CONFLICT);
        }
        const code = await this.createVerififyEmailCode();
        await this.mailService.sendCode(email, name, code);
        this.logger.log('Email de verificacion enviado a:  ' + email);
        const validated = authentication_enum_1.VERIFICATION_CODE_STATUS.IN_PROGRESS;
        const hashedPassword = await this.hashPassword(password);
        const newUser = await this.userService.create(name, email, hashedPassword, lastname, validated, code);
        return this.userService.getUser(newUser);
    }
    async createVerififyEmailCode() {
        return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
    }
    async doesPasswordMatch(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    async validate(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user || user.validated !== authentication_enum_1.VERIFICATION_CODE_STATUS.VALIDATED) {
            this.logger.log('User not found or email not validated.');
            return null;
        }
        const doesPasswordMatch = await this.doesPasswordMatch(password, user.password);
        if (!doesPasswordMatch) {
            this.logger.log('Invalid Credentials');
            return null;
        }
        return this.userService.getUser(user);
    }
    async login({ email, password }) {
        const user = await this.validate(email, password);
        if (!user)
            throw new common_1.HttpException('Invalid credentials.', common_1.HttpStatus.UNAUTHORIZED);
        const token = this.loginWithCredentials(user);
        return token;
    }
    async loginWithCredentials(user) {
        const payload = { user };
        return {
            token: this.jwtTokenService.sign(payload),
        };
    }
    async verifyEmailCode({ email, code, }) {
        try {
            const user = await this.userService.findByEmail(email);
            if (user.verificationCode !== code)
                throw new common_1.HttpException('Invalid or expired code.', common_1.HttpStatus.CONFLICT);
            user.validated = authentication_enum_1.VERIFICATION_CODE_STATUS.VALIDATED;
            await this.userService.update(user);
            return true;
        }
        catch (error) {
            this.logger.error(error.message);
            return false;
        }
    }
    async validatePasswordToken(passwordTokenDTO) {
        const { email, passwordToken } = passwordTokenDTO;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.log('El usuario no existe: ' + email);
            return new common_1.HttpException('USER_NOT_FOUND', 404);
        }
        const { id } = user;
        const validate = (await this.IsExpired(user.resetPasswordToken)) &&
            (await this.compareResetPasswordCode(passwordToken, user));
        const result = { id, email, validate };
        return result;
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