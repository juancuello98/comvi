"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const auth_firebase_controller_1 = require("./auth-firebase.controller");
const auth_firebase_service_1 = require("./auth-firebase.service");
let AuthFirebaseModule = class AuthFirebaseModule {
};
AuthFirebaseModule = __decorate([
    (0, common_1.Module)({
        providers: [auth_firebase_service_1.AuthFirebaseService],
        controllers: [auth_firebase_controller_1.AuthFirebaseController],
        exports: [auth_firebase_service_1.AuthFirebaseService]
    })
], AuthFirebaseModule);
exports.AuthFirebaseModule = AuthFirebaseModule;
//# sourceMappingURL=auth-firebase.module.js.map