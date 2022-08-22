"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordTokenModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const passwordToken_controller_1 = require("./passwordToken.controller");
const passwordToken_schema_1 = require("./passwordToken.schema");
const passwordToken_service_1 = require("./passwordToken.service");
let PasswordTokenModule = class PasswordTokenModule {
};
PasswordTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: passwordToken_schema_1.PasswordToken.name, schema: passwordToken_schema_1.PasswordTokenSchema }])],
        controllers: [passwordToken_controller_1.PasswordTokenController],
        providers: [passwordToken_service_1.PasswordTokenService],
        exports: [passwordToken_service_1.PasswordTokenService],
    })
], PasswordTokenModule);
exports.PasswordTokenModule = PasswordTokenModule;
//# sourceMappingURL=passwordToken.module.js.map