"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_module_1 = require("../../common/common.module");
const transactions_module_1 = require("../transactions/transactions.module");
const trips_resume_schema_1 = require("../trips-resume/trips-resume.schema");
const user_schema_1 = require("../users/user.schema");
const trip_controller_1 = require("./trip.controller");
const trip_schema_1 = require("./trip.schema");
const trip_service_1 = require("./trip.service");
let TripModule = class TripModule {
};
TripModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: trip_schema_1.Trip.name, schema: trip_schema_1.TripSchema },
                { name: trips_resume_schema_1.TripResume.name, schema: trips_resume_schema_1.TripResumeSchema }
            ]), common_module_1.CommonModule, transactions_module_1.TransactionModule
        ],
        controllers: [trip_controller_1.TripController],
        providers: [trip_service_1.TripService],
        exports: [trip_service_1.TripService],
    })
], TripModule);
exports.TripModule = TripModule;
//# sourceMappingURL=trip.module.js.map