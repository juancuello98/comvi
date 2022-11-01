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
const response_helper_1 = require("../../common/helpers/http/response.helper");
const status_enum_1 = require("./enums/status.enum");
const trip_schema_1 = require("../trips/trip.schema");
const user_schema_1 = require("../users/user.schema");
let RequestService = RequestService_1 = class RequestService {
    constructor(requestModel, tripModel, userModel, responseHelper) {
        this.requestModel = requestModel;
        this.tripModel = tripModel;
        this.userModel = userModel;
        this.responseHelper = responseHelper;
        this.logger = new common_1.Logger(RequestService_1.name);
    }
    async findByStatus(status) {
        const requests = this.requestModel.find({ status }).exec();
        return this.responseHelper.makeResponse(true, 'requests by status succesfully.', requests, common_1.HttpStatus.OK);
    }
    async findMyRequests(email) {
        let message = 'Requests not found.';
        try {
            const items = await this.requestModel.find({ email: email }).sort({ createdTimestamp: 'desc' }).exec();
            if (items.length == 0)
                this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            message = 'Successfully found requests';
            return this.responseHelper.makeResponse(false, message, items, common_1.HttpStatus.OK);
        }
        catch (error) {
            this.logger.error('Error in: ', error);
            return this.responseHelper.makeResponse(true, error.message, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
            this.logger.error('Error: ', error);
            return this.responseHelper.makeResponse(true, 'Error in findById', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async send(req) {
        try {
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
        catch (error) {
            this.logger.error(error);
            return this.responseHelper.makeResponse(false, `${RequestService_1.name}: error in send method.`, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(request) {
        return request.save();
    }
    async getRequestsForTrips(email) {
        try {
            const trips = await this.tripModel.find({ driverEmail: email, status: 'OPEN' });
            if (trips.length === 0) {
                this.logger.log('Not found trips with OPEN status.');
                return this.responseHelper.makeResponse(false, `${RequestService_1.name}: The user not have trips OPEN.`, null, common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.log('Init process to get requests from trips...');
            const requests = await Promise.all(trips.map(async (x) => await this.getRequests(x)));
            if (requests.length === 0) {
                this.logger.log('Not found requests in trips with OPEN status.');
                return this.responseHelper.makeResponse(false, `${RequestService_1.name}: The user driver not have trips with requests.`, null, common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Process finished. Requests: ${JSON.stringify(requests)}`);
            const responseRequests = requests.flat();
            responseRequests.sort(this.custom_sort);
            return this.responseHelper.makeResponse(false, `${RequestService_1.name}: Requests founded.`, responseRequests, common_1.HttpStatus.OK);
        }
        catch (error) {
            return this.responseHelper.makeResponse(true, `${RequestService_1.name}: error ${error.message}.`, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    custom_sort(a, b) {
        return new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime();
    }
    async getRequests(trip) {
        let requests = [];
        for (const req in trip.tripsRequests) {
            let id = trip.tripsRequests[req];
            let requestFounded = await this.requestModel.findById(id);
            requests.push(this._getRequestDetails(requestFounded, trip));
            console.log(`${trip.id}: ${JSON.stringify(requests)}`);
        }
        return requests;
    }
    _getRequestDetails(request, trip) {
        return {
            id: request.id,
            email: request.email,
            description: request.description,
            hasEquipment: request.hasEquipment,
            hasPartner: request.hasPartner,
            partnerQuantity: request.partnerQuantity,
            totalPassenger: request.totalPassenger,
            createdTimestamp: request.createdTimestamp,
            status: request.status,
            tripId: request.tripId,
            trip: trip
        };
    }
};
RequestService = RequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __param(1, (0, mongoose_1.InjectModel)(trip_schema_1.Trip.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        response_helper_1.ResponseHelper])
], RequestService);
exports.RequestService = RequestService;
//# sourceMappingURL=request.service.js.map