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
var TransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_helper_1 = require("../../common/helpers/http/response.helper");
const trip_schema_1 = require("../trips/trip.schema");
const user_schema_1 = require("../users/user.schema");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(tripModel, userModel, responseHelper) {
        this.tripModel = tripModel;
        this.userModel = userModel;
        this.responseHelper = responseHelper;
        this.logger = new common_1.Logger(TransactionService_1.name);
    }
    async processSendRequest(request, userEmail) {
        await this.updateUserRequests(userEmail, request.id);
        await this.updateTripRequests(request.tripId, request.id);
    }
    async notifyUpdateTripStatus(usersToNotifiy) {
        throw new Error('Method not implemented.');
    }
    async updateUserRequests(email, id) {
        const update = { "$push": { "joinRequests": id } };
        const user = await this.userModel.findOneAndUpdate({ email: email }, update);
        if (!user)
            return user;
        this.logger.log('updateUserRequests: User updated when new request in joinRequests.');
        return await user.save();
    }
    async updateTripRequests(tripId, requestId) {
        const update = { "$push": { "tripsRequests": requestId } };
        const trip = await this.tripModel.findByIdAndUpdate(tripId, update);
        if (!trip)
            return trip;
        this.logger.log('updateTripRequests: Trip updated when new request in tripsRequests.');
        return await trip.save();
    }
};
TransactionService = TransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(trip_schema_1.Trip.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        response_helper_1.ResponseHelper])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map