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
const trip_schema_1 = require("./trip.schema");
const state_enum_1 = require("./enums/state.enum");
const response_helper_1 = require("../../common/helpers/http/response.helper");
const trips_resume_schema_1 = require("../trips-resume/trips-resume.schema");
const date_helper_1 = require("../../common/helpers/date/date.helper");
const user_schema_1 = require("../users/user.schema");
const crypto_1 = require("crypto");
let TripService = TripService_1 = class TripService {
    constructor(userModel, tripModel, tripResumeModel, responseHelper) {
        this.userModel = userModel;
        this.tripModel = tripModel;
        this.tripResumeModel = tripResumeModel;
        this.responseHelper = responseHelper;
        this.logger = new common_1.Logger(TripService_1.name);
    }
    async findTripsByDriver(driverEmail) {
        console.log(driverEmail);
        const trips = await this.findByDriver(driverEmail);
        return this.responseHelper.makeResponse(false, 'User trips found.', trips, common_1.HttpStatus.OK);
    }
    async findByDriver(driverEmail) {
        console.log(driverEmail);
        const trips = await this.tripModel.find({ driverEmail }).sort({ createdTimestamp: 'desc' }).exec();
        this.logger.log(`Trips of user ${driverEmail} founded. STATUS: SUCCESS`);
        return trips;
    }
    async findByStatus(status) {
        return this.tripModel.find({ status }).exec();
    }
    async findAll(email) {
        let message = 'Trips not found';
        try {
            const items = await this.tripModel.find().sort({ createdTimestamp: 'desc' }).exec();
            if (items.length == 0)
                this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            message = 'Successfully found trips';
            const itemsFiltered = items.filter(x => x.driverEmail !== email);
            if (itemsFiltered.length == 0)
                this.responseHelper.makeResponse(false, message, null, common_1.HttpStatus.NOT_FOUND);
            return this.responseHelper.makeResponse(false, message, itemsFiltered, common_1.HttpStatus.OK);
        }
        catch (error) {
            console.error('Error in findAll: ', error);
            return this.responseHelper.makeResponse(true, message, null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(tripId) {
        try {
            let message = 'Successfully found trips';
            let status = common_1.HttpStatus.OK;
            let trip = await this.tripModel.findById(tripId).exec();
            if (!trip) {
                trip = null;
                message = 'Not found trips';
                status = common_1.HttpStatus.NOT_FOUND;
            }
            ;
            return this.responseHelper.makeResponse(false, message, trip, status);
        }
        catch (error) {
            console.error('Error: ', error);
            return this.responseHelper.makeResponse(true, 'Error in findById', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(trip) {
        const newTrip = new this.tripModel({
            driverEmail: trip.email,
            origin: trip.origin,
            destination: trip.destination,
            description: trip.description,
            allowPackage: trip.allowPackage,
            allowPassenger: trip.allowPassenger,
            peopleQuantity: trip.peopleQuantity,
            placesAvailable: trip.peopleQuantity,
            vehicle: trip.vehicle,
            startedTimestamp: trip.startedTimestamp,
            status: state_enum_1.TripStatus.OPEN,
            createdTimestamp: new Date().toISOString()
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
    async cancel(id, userEmail) {
        this.logger.log('Initialize process to cancel trip...');
        const filter = {
            driverEmail: userEmail,
            _id: id
        };
        const hasUserTrip = await this.tripModel.findOne(filter);
        if (!hasUserTrip)
            return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail}`, null, common_1.HttpStatus.NOT_FOUND);
        if (hasUserTrip.status === state_enum_1.TripStatus.READY_FOR_START || hasUserTrip.status === state_enum_1.TripStatus.FINISHED) {
            return this.responseHelper.makeResponse(false, `Incorrect trip status: ${hasUserTrip.status}`, null, common_1.HttpStatus.OK);
        }
        hasUserTrip.status = state_enum_1.TripStatus.CANCELED;
        const tripUpdated = hasUserTrip.save();
        this.logger.log(`Update trip status to ${hasUserTrip.status}`);
        return this.responseHelper.makeResponse(false, `Trip successfully cancelled : ${id}`, tripUpdated, common_1.HttpStatus.OK);
    }
    async init(id, userEmail) {
        this.logger.log('Initialize process to init trip...');
        let today = (0, date_helper_1.todayDateWithFormat)();
        const filter = {
            driverEmail: userEmail,
            _id: id
        };
        const hasUserTrip = await this.tripModel.findOne(filter);
        if (!hasUserTrip)
            return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail}`, null, common_1.HttpStatus.NOT_FOUND);
        if (hasUserTrip.status !== state_enum_1.TripStatus.OPEN) {
            return this.responseHelper.makeResponse(false, `Incorrect trip status: ${hasUserTrip.status}`, null, common_1.HttpStatus.OK);
        }
        const dateTrip = hasUserTrip.startedTimestamp.substring(0, 10);
        this.logger.log(`startedTimestamp ${dateTrip} and today is ${today}`);
        if (dateTrip !== today) {
            return this.responseHelper.makeResponse(false, `The trip contains a different start date: ${dateTrip}`, null, common_1.HttpStatus.OK);
        }
        if (hasUserTrip.passengers.length === 0) {
            return this.responseHelper.makeResponse(false, `Your trip does not contain passengers: ${hasUserTrip.passengers.length}`, null, common_1.HttpStatus.OK);
        }
        hasUserTrip.status = state_enum_1.TripStatus.IN_PROGRESS;
        const newTripResume = new this.tripResumeModel({
            passengers: hasUserTrip.passengers,
            fechaHoraRealInicio: new Date().toISOString()
        });
        newTripResume.save();
        this.logger.log(`Create new trip resume with id ${newTripResume.id}`);
        hasUserTrip.tripResumeId = newTripResume.id;
        const tripUpdated = hasUserTrip.save();
        this.logger.log(`Update trip status to ${hasUserTrip.status}`);
        return this.responseHelper.makeResponse(false, `Trip successfully cancelled : ${id}`, tripUpdated, common_1.HttpStatus.OK);
    }
    async finish(id, userEmail) {
        this.logger.log('Initialize process to finish trip...');
        const filter = {
            driverEmail: userEmail,
            _id: id
        };
        const hasUserTrip = await this.tripModel.findOne(filter);
        if (!hasUserTrip)
            return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail}`, null, common_1.HttpStatus.NOT_FOUND);
        if (hasUserTrip.status !== state_enum_1.TripStatus.IN_PROGRESS) {
            return this.responseHelper.makeResponse(false, `Incorrect trip status: ${hasUserTrip.status}`, null, common_1.HttpStatus.OK);
        }
        hasUserTrip.status = state_enum_1.TripStatus.FINISHED;
        const tripUpdated = hasUserTrip.save();
        this.logger.log(`Update trip status to ${hasUserTrip.status}`);
        const _filter = { _id: hasUserTrip.tripResumeId };
        const update = { fechaHoraRealFin: new Date().toISOString() };
        const tripResume = await this.tripResumeModel.findOneAndUpdate(_filter, update);
        tripResume.save();
        return this.responseHelper.makeResponse(false, `Trip successfully finished : ${id}`, tripUpdated, common_1.HttpStatus.OK);
    }
    async listOfPassengers(tripId) {
        try {
            let message = 'Passengers inside the trip.';
            let status = common_1.HttpStatus.OK;
            const trip = await this.tripModel.findOne({ _id: tripId }).exec();
            if (!trip) {
                message = 'Not found trips';
                status = common_1.HttpStatus.NOT_FOUND;
                return this.responseHelper.makeResponse(false, message, null, status);
            }
            ;
            const passengersOfTrip = await this.userModel.find().where('_id').in(trip.passengers);
            const resp = passengersOfTrip.map(x => this.userWraped(x));
            return this.responseHelper.makeResponse(false, message, resp, status);
        }
        catch (error) {
            console.error('Error: ', error);
            return this.responseHelper.makeResponse(true, 'Error in listWithPassengers.', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    userWraped(user) {
        return {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            quantityReviews: (0, crypto_1.randomInt)(3, 8),
            averageRating: (0, crypto_1.randomInt)(1, 5),
            identityHasVerified: true
        };
    }
    wrapperListWithPassengers(trip, passengers) {
        return {};
    }
};
TripService = TripService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(trip_schema_1.Trip.name)),
    __param(2, (0, mongoose_1.InjectModel)(trips_resume_schema_1.TripResume.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        response_helper_1.ResponseHelper])
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip.service.js.map