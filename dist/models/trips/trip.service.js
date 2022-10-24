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
const state_enum_1 = require("./enums/state.enum");
let TripService = TripService_1 = class TripService {
    constructor(tripModel, userService) {
        this.tripModel = tripModel;
        this.userService = userService;
        this.logger = new common_1.Logger(TripService_1.name);
        this.makeResponse = (hasError, message, data, status) => {
            return {
                hasError: hasError,
                message: message,
                data: data,
                status: status
            };
        };
    }
    async findTripsByDriver(driverEmail) {
        console.log(driverEmail);
        const trips = await this.findByDriver(driverEmail);
        return this.makeResponse(false, 'User trips found.', trips, common_1.HttpStatus.OK);
    }
    async findByDriver(driverEmail) {
        console.log(driverEmail);
        const trips = await this.tripModel.find({ driverEmail }).exec();
        this.logger.log(`Trips of user ${driverEmail} founded. STATUS: SUCCESS`);
        return trips;
    }
    async findByStatus(status) {
        return this.tripModel.find({ status }).exec();
    }
    async findAll(email) {
        console.log('findAll: ', email);
        let message = 'Trips not found';
        try {
            const items = await this.tripModel.find().exec();
            if (items.length == 0)
                this.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            message = 'Successfully found trips';
            const itemsFiltered = items.filter(x => x.driverEmail !== email);
            if (itemsFiltered.length == 0)
                this.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            return this.makeResponse(false, message, itemsFiltered, common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error('Error in findAll: ', error);
            return this.makeResponse(true, message, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(tripId) {
        try {
            let trip = await this.tripModel.findById(tripId).exec();
            if (!trip)
                trip = null;
            const message = 'Successfully found trips';
            return this.makeResponse(false, message, trip, common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error('Error: ', error);
            return this.makeResponse(true, 'Error in findById', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(trip) {
        const newTrip = new this.tripModel({
            driverEmail: trip.email,
            origin: trip.origin,
            destination: trip.destination,
            allowPackage: trip.allowPackage,
            allowPassenger: trip.allowPassenger,
            peopleQuantity: trip.peopleQuantity,
            placesAvailable: trip.peopleQuantity,
            vehicle: trip.vehicle,
            checkIn: trip.startedTimestamp,
            status: state_enum_1.TripStatus.OPEN,
            createdTimestamp: Date.now().toString()
        });
        const tripCreated = await newTrip.save();
        const resp = {
            hasError: false,
            message: 'Trip was created succesfully.',
            data: tripCreated,
            status: common_1.HttpStatus.CREATED
        };
        return resp;
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