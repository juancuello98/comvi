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
exports.PasswordTokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const passwordToken_schema_1 = require("./passwordToken.schema");
let PasswordTokenService = class PasswordTokenService {
    constructor(passwordTokenModel) {
        this.passwordTokenModel = passwordTokenModel;
    }
    GenerateToken() {
        const token = new passwordToken_schema_1.PasswordToken();
        const auxDate = new Date();
        token.created = auxDate;
        auxDate.setTime(auxDate.getTime() + 60 * 60 * 1000);
        token.expire = auxDate;
        token.code = this.generateRandomString(6);
        return token;
    }
    IsExpired(token) {
        const auxDate = new Date();
        if (auxDate < token.expire) {
            return true;
        }
        else {
            return false;
        }
    }
    generateRandomString(num) {
        let result1 = Math.random().toString(36).substring(0, num);
        return result1;
    }
};
PasswordTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(passwordToken_schema_1.PasswordToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PasswordTokenService);
exports.PasswordTokenService = PasswordTokenService;
//# sourceMappingURL=passwordToken.service.js.map