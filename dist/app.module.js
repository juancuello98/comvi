"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const authentication_module_1 = require("./modules/auth/authentication.module");
const users_module_1 = require("./modules/users/users.module");
const auth_firebase_middleware_1 = require("./modules/auth-firebase/auth-firebase.middleware");
const mail_module_1 = require("./modules/mailer/mail.module");
const auth_firebase_module_1 = require("./modules/auth-firebase/auth-firebase.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_firebase_middleware_1.AuthFirebaseMiddleware).forRoutes({
            path: '*',
            method: common_1.RequestMethod.ALL
        });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            authentication_module_1.AuthModule,
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forRoot('mongodb+srv://comvi2022:comviadmin123@cluster0.tplmj.mongodb.net/?retryWrites=true&w=majority'), mail_module_1.MailModule, auth_firebase_module_1.AuthFirebaseModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map