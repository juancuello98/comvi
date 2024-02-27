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
const config_1 = require("@nestjs/config");
const authentication_module_1 = require("./authentication/authentication.module");
const user_module_1 = require("./models/users/user.module");
const config_module_1 = require("./config/mail/config.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const trip_module_1 = require("./models/trips/trip.module");
const common_module_1 = require("./common/common.module");
const vehicles_module_1 = require("./models/vehicles/vehicles.module");
const request_module_1 = require("./models/requests/request.module");
const valuations_module_1 = require("./models/valuations/valuations.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URL),
            config_module_1.MailModule,
            authentication_module_1.AuthModule,
            user_module_1.UserModule,
            trip_module_1.TripModule,
            common_module_1.CommonModule,
            vehicles_module_1.VehiclesModule,
            request_module_1.RequestModule,
            valuations_module_1.ValuationsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map