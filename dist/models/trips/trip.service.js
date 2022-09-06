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
var TripService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../users/user.service");
const trip_schema_1 = require("./trip.schema");
const crypto_1 = require("crypto");
let TripService = TripService_1 = class TripService {
    constructor(tripModel, userService) {
        this.tripModel = tripModel;
        this.userService = userService;
        this.logger = new common_1.Logger(TripService_1.name);
    }
    _getTripDetails(trip) {
        return {
            id: trip._id,
            destination: trip.destinationId,
            origen: trip.originId,
            checkIn: trip.checkIn,
            checkOut: trip.checkOut,
            kilometros: (0, crypto_1.randomInt)(248),
            peopleCapacity: trip.peopleCapacity,
            status: trip.status
        };
    }
    async findTripsByDriver(driverId) {
        return this.tripModel.find({ driverId }).exec();
    }
    async findByStatus(status) {
        return this.tripModel.find({ status }).exec();
    }
    async findAll() {
        const items = await this.tripModel.find().exec();
        if (items.length == 0)
            return null;
        return items;
    }
    async findById(tripId) {
        const trip = await this.tripModel.findById(tripId).exec();
        if (!trip)
            return null;
        return this._getTripDetails(trip);
    }
    async create(trip) {
        const user = await this.userService.findByEmail(trip.driverEmail);
        const newTrip = new this.tripModel({
            originId: trip.origin,
            destinationId: trip.destination,
            peopleCapacity: trip.peopleCapacity,
            driverId: user._id,
            checkOut: trip.checkOut,
            checkIn: trip.checkIn,
            status: trip.status
        });
        return newTrip.save();
    }
    async update(trip) {
        return trip.save();
    }
};
TripService = TripService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(trip_schema_1.Trip.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip.service.js.map