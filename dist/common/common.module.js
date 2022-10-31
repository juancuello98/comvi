"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const request_helper_1 = require("./helpers/http/request.helper");
const response_helper_1 = require("./helpers/http/response.helper");
const auth_firebase_middleware_1 = require("./middleware/auth-firebase.middleware");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let CommonModule = class CommonModule {
};
CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        controllers: [],
        providers: [
            response_helper_1.ResponseHelper,
            request_helper_1.RequestHelper,
            jwt_auth_guard_1.JwtAuthGuard,
            auth_firebase_middleware_1.AuthFirebaseMiddleware,
            jwt_strategy_1.JwtStrategy
        ],
        exports: [
            response_helper_1.ResponseHelper,
            request_helper_1.RequestHelper
        ]
    })
], CommonModule);
exports.CommonModule = CommonModule;
//# sourceMappingURL=common.module.js.map