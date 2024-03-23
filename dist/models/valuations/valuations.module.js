"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationsModule = void 0;
const common_1 = require("@nestjs/common");
const valuations_service_1 = require("./valuations.service");
const valuations_controller_1 = require("./valuations.controller");
const user_schema_1 = require("../users/user.schema");
const trip_schema_1 = require("../trips/trip.schema");
const mongoose_1 = require("@nestjs/mongoose");
const request_schema_1 = require("../requests/request.schema");
const common_module_1 = require("../../common/common.module");
const valuation_schema_1 = require("./entities/valuation.schema");
let ValuationsModule = class ValuationsModule {
};
ValuationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: Request.name, schema: request_schema_1.RequestSchema },
                { name: trip_schema_1.Trip.name, schema: trip_schema_1.TripSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: valuation_schema_1.Valuation.name, schema: valuation_schema_1.ValuationSchema },
            ]),
            common_module_1.CommonModule,
        ],
        controllers: [valuations_controller_1.ValuationsController],
        providers: [valuations_service_1.ValuationsService],
        exports: [valuations_service_1.ValuationsService],
    })
], ValuationsModule);
exports.ValuationsModule = ValuationsModule;
//# sourceMappingURL=valuations.module.js.map