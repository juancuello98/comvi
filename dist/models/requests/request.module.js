"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_module_1 = require("../../common/common.module");
const transactions_module_1 = require("../transactions/transactions.module");
const trip_schema_1 = require("../trips/trip.schema");
const user_schema_1 = require("../users/user.schema");
const request_controller_1 = require("./request.controller");
const request_schema_1 = require("./request.schema");
const request_service_1 = require("./request.service");
let RequestModule = class RequestModule {
};
RequestModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: request_schema_1.Request.name, schema: request_schema_1.RequestSchema },
                { name: trip_schema_1.Trip.name, schema: trip_schema_1.TripSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema }
            ]),
            common_module_1.CommonModule,
            transactions_module_1.TransactionModule
        ],
        controllers: [request_controller_1.RequestController],
        providers: [request_service_1.RequestService],
        exports: [request_service_1.RequestService],
    })
], RequestModule);
exports.RequestModule = RequestModule;
//# sourceMappingURL=request.module.js.map