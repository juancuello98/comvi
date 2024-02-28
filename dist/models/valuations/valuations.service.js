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
var ValuationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_helper_1 = require("../../common/helpers/http/response.helper");
const trip_schema_1 = require("../trips/trip.schema");
const user_schema_1 = require("../users/user.schema");
const valuation_schema_1 = require("./entities/valuation.schema");
let ValuationsService = ValuationsService_1 = class ValuationsService {
    constructor(valuationModel, tripModel, userModel, responseHelper) {
        this.valuationModel = valuationModel;
        this.tripModel = tripModel;
        this.userModel = userModel;
        this.responseHelper = responseHelper;
        this.logger = new common_1.Logger(ValuationsService_1.name);
    }
    async create(createValuationDto) {
        const input = {
            email: createValuationDto.email,
            tripId: createValuationDto.tripId,
            detalle: createValuationDto.detalle,
            fechaHoraCreado: Date.now,
            fechaHoraModificado: Date.now,
            puntaje: createValuationDto.puntaje,
        };
        const newValuation = new this.valuationModel(input);
        try {
            const updatedValuation = await newValuation.save();
            console.log('Succesfully created: %o', updatedValuation);
        }
        catch (error) {
            console.log('Error: %s', error.message);
        }
    }
};
ValuationsService = ValuationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(valuation_schema_1.Valuation.name)),
    __param(1, (0, mongoose_1.InjectModel)(trip_schema_1.Trip.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        response_helper_1.ResponseHelper])
], ValuationsService);
exports.ValuationsService = ValuationsService;
//# sourceMappingURL=valuations.service.js.map