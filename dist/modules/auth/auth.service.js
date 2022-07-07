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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt_1 = require("bcrypt");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../users/entities/user.entity");
const enum_auth_1 = require("./enums/enum-auth");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(userObject) {
        const { password } = userObject;
        const hashPass = await (0, bcrypt_1.hash)(password, 10);
        userObject = Object.assign(Object.assign({}, userObject), { password: hashPass });
        const userCreated = await this.userModel.create(userObject);
        return userCreated;
    }
    async login(userObjectLogin) {
        const { email, password } = userObjectLogin;
        const findUser = await this.userModel.findOne({ email });
        if (!findUser)
            new common_1.HttpException('USER_NOT_FOUND', 404);
        const checkPassword = await (0, bcrypt_1.compare)(password, findUser.password);
        if (!checkPassword)
            new common_1.HttpException('PASSWORD_INCORRECT', 403);
        const data = { success: true, message: enum_auth_1.MESSAGE_REQ.MESSAGE_200 };
        return data;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map