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
        const newValuation = new this.valuationModel({
            email: createValuationDto.email,
            tripId: createValuationDto.tripId,
            detalle: createValuationDto.detalle,
            fechaHoraCreado: Date.now,
            fechaHoraModificado: Date.now,
            puntaje: createValuationDto.puntaje
        });
        try {
            const hasTrip = await this.tripModel.findById(createValuationDto.tripId);
            if (!hasTrip) {
                this.logger.log(`Not found trip ${createValuationDto.tripId} for user ${createValuationDto.email}`);
                return this.responseHelper.makeResponse(false, `Not found trip ${createValuationDto.tripId} for user ${createValuationDto.email}`, null, common_1.HttpStatus.NOT_FOUND);
            }
            const updatedValuation = await newValuation.save();
            hasTrip.valuations.push(updatedValuation.id);
            this.logger.log(`A new valuation was added to the trip ${createValuationDto.tripId} for user ${createValuationDto.email}`);
            return this.responseHelper.makeResponse(false, `A new valuation was added to the trip ${createValuationDto.tripId} for user ${createValuationDto.email}`, updatedValuation, common_1.HttpStatus.CREATED);
        }
        catch (error) {
            this.logger.log('Error in create: ', error);
            return this.responseHelper.makeResponse(true, "The valuation was not created", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(email) {
        let message = 'valuations not found';
        try {
            const items = await this.valuationModel.find().sort({ createdTimestamp: 'desc' }).exec();
            if (items.length == 0)
                return this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            message = 'Successfully found valuations';
            const itemsFiltered = items.filter(x => x.email == email);
            if (itemsFiltered.length == 0)
                this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            return this.responseHelper.makeResponse(false, message, itemsFiltered, common_1.HttpStatus.OK);
        }
        catch (error) {
            this.logger.log('Error in findAll: ', error);
            return this.responseHelper.makeResponse(true, message, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        let message = 'valuation not found';
        try {
            const valuation = await this.valuationModel.findById(id).exec();
            if (!valuation)
                return this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            message = 'Valuation Successfully founded ';
            return this.responseHelper.makeResponse(false, message, valuation, common_1.HttpStatus.OK);
        }
        catch (error) {
            this.logger.log('Error in findById: ', error);
            return this.responseHelper.makeResponse(true, message, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(updateValuationDto) {
        try {
            const hasValuation = await this.valuationModel.findByIdAndUpdate(updateValuationDto.id, updateValuationDto);
            if (!hasValuation) {
                this.logger.log(`Not found valuation ${updateValuationDto.id} for user ${updateValuationDto.email}`);
                return this.responseHelper.makeResponse(false, `Not found valuation ${updateValuationDto.id} for user ${updateValuationDto.email}`, null, common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.log(`The valuation of the trip ${updateValuationDto.tripId} for user ${updateValuationDto.email} was updated`);
            return this.responseHelper.makeResponse(false, `The valuation of the trip ${updateValuationDto.tripId} for user ${updateValuationDto.email} was updated`, hasValuation, common_1.HttpStatus.CREATED);
        }
        catch (error) {
            this.logger.log('Error in create: ', error);
            return this.responseHelper.makeResponse(true, "The valuation was not created", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const hasValuation = await this.valuationModel.findByIdAndDelete(id);
            if (!hasValuation) {
                this.logger.log(`Not found valuation ${id} for user`);
                return this.responseHelper.makeResponse(false, `Not found valuation ${id} for user`, null, common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.log(`The valuation of the trip ${hasValuation.tripId} for user ${hasValuation.email} was deleted`);
            return this.responseHelper.makeResponse(false, `The valuation of the trip ${hasValuation.tripId} for user ${hasValuation.email} was deleted`, hasValuation, common_1.HttpStatus.CREATED);
        }
        catch (error) {
            this.logger.log('Error in create: ', error);
            return this.responseHelper.makeResponse(true, "The valuation was not created", null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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