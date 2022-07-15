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
exports.AuthFirebaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_firebase_service_1 = require("./auth-firebase.service");
const login_auth_dto_1 = require("../configs/DTOs/login-auth.dto");
const register_auth_dto_1 = require("../configs/DTOs/register-auth-dto");
let AuthFirebaseController = class AuthFirebaseController {
    constructor(authService) {
        this.authService = authService;
    }
    registerUser(userObject) {
        console.log('[REGISTER_USER]');
        return this.authService.createUserInFirebaseProject(userObject.email, userObject.password);
    }
    loginUser(userObjectLogin) {
        return this.authService.loginInFirebase(userObjectLogin.email, userObjectLogin.password);
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterAuthDto]),
    __metadata("design:returntype", void 0)
], AuthFirebaseController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_auth_dto_1.LoginAuthDTO]),
    __metadata("design:returntype", void 0)
], AuthFirebaseController.prototype, "loginUser", null);
AuthFirebaseController = __decorate([
    (0, swagger_1.ApiTags)('firebase/auth'),
    (0, common_1.Controller)('firebase/auth'),
    __metadata("design:paramtypes", [auth_firebase_service_1.AuthFirebaseService])
], AuthFirebaseController);
exports.AuthFirebaseController = AuthFirebaseController;
//# sourceMappingURL=auth-firebase.controller.js.map