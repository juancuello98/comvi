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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authentication_service_1 = require("./authentication.service");
const existing_user_dto_1 = require("../models/users/dto/existing-user.dto");
const new_user_dto_1 = require("../models/users/dto/new-user.dto");
const user_verification_dto_1 = require("../models/users/dto/user-verification.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const request_reset_password_dto_1 = require("../models/PasswordToken/dto/request-reset-password-dto");
const reset_password_dto_1 = require("../models/PasswordToken/dto/reset-password-dto");
const token_password_dto_1 = require("../models/PasswordToken/dto/token-password.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    registerUser(user) {
        return this.authService.register(user);
    }
    validateTokenEmail(user) {
        return this.authService.validationCode(user);
    }
    validatePasswordToken(token) {
        return this.authService.validatePasswordToken(token);
    }
    loginUser(user) {
        return this.authService.login(user);
    }
    requestResetPassword(token) {
        return this.authService.requestResetPassword(token);
    }
    resetPassword(token) {
        return this.authService.resetPassword(token);
    }
    testUser(user) {
        return { email: user.email };
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [new_user_dto_1.NewUserDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('validate/token'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_verification_dto_1.UserVerificationDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateTokenEmail", null);
__decorate([
    (0, common_1.Post)('validate/passwordtoken'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_password_dto_1.PasswordTokenDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validatePasswordToken", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [existing_user_dto_1.ExistingtUserDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('resetpassword/requestresetpassword'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_reset_password_dto_1.RequestResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestResetPassword", null);
__decorate([
    (0, common_1.Post)('resetpassword/resetpassword'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('test'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [existing_user_dto_1.ExistingtUserDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "testUser", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [authentication_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=authentication.controller.js.map