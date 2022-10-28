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
var RequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const request_schema_1 = require("./request.schema");
const response_helper_1 = require("../../common/helpers/response.helper");
const status_enum_1 = require("./enums/status.enum");
let RequestService = RequestService_1 = class RequestService {
    constructor(requestModel, responseHelper) {
        this.requestModel = requestModel;
        this.responseHelper = responseHelper;
        this.logger = new common_1.Logger(RequestService_1.name);
    }
    async findByStatus(status) {
        const requests = this.requestModel.find({ status }).exec();
        return this.responseHelper.makeResponse(true, 'requests by status succesfully.', requests, common_1.HttpStatus.OK);
    }
    async findAll(email) {
        let message = 'requests not found';
        try {
            const items = await this.requestModel.find().exec();
            if (items.length == 0)
                this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            message = 'Successfully found requests';
            const itemsFiltered = items.filter(x => x.email !== email);
            if (itemsFiltered.length == 0)
                this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            return this.responseHelper.makeResponse(false, message, itemsFiltered, common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error('Error in: ', error);
            return this.responseHelper.makeResponse(true, message, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(requestId) {
        try {
            let message = 'Successfully found requests';
            let status = common_1.HttpStatus.OK;
            let request = await this.requestModel.findById(requestId).exec();
            if (!request) {
                request = null;
                message = 'Not found requests';
                status = common_1.HttpStatus.NOT_FOUND;
            }
            ;
            return this.responseHelper.makeResponse(false, message, request, status);
        }
        catch (error) {
            console.error('Error: ', error);
            return this.responseHelper.makeResponse(true, 'Error in findById', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(req) {
        let partnerQuantity = !req.partnerQuantity ? 0 : req.partnerQuantity;
        const newRequest = new this.requestModel({
            email: req.email,
            tripId: req.tripId,
            description: req.description,
            hasEquipment: req.hasEquipment,
            hasPartner: req.hasPartner,
            partnerQuantity: partnerQuantity,
            totalPassenger: 1 + partnerQuantity,
            createdTimestamp: new Date().toISOString(),
            status: status_enum_1.StatusRequest.ON_HOLD
        });
        const requestCreated = await newRequest.save();
        return this.responseHelper.makeResponse(false, 'Request was sended succesfully.', requestCreated, common_1.HttpStatus.OK);
    }
    async update(request) {
        return request.save();
    }
};
RequestService = RequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        response_helper_1.ResponseHelper])
], RequestService);
exports.RequestService = RequestService;
//# sourceMappingURL=request.service.js.map