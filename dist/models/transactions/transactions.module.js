"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_module_1 = require("../../common/common.module");
const trip_schema_1 = require("../trips/trip.schema");
const user_schema_1 = require("../users/user.schema");
const transaction_service_1 = require("./transaction.service");
let TransactionModule = class TransactionModule {
};
TransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: trip_schema_1.Trip.name, schema: trip_schema_1.TripSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema }
            ]),
            common_module_1.CommonModule
        ],
        providers: [transaction_service_1.TransactionService],
        exports: [transaction_service_1.TransactionService],
    })
], TransactionModule);
exports.TransactionModule = TransactionModule;
//# sourceMappingURL=transactions.module.js.map