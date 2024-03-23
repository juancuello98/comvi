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
const user_service_1 = require("../users/user.service");
const response_helper_1 = require("../../common/helpers/http/response.helper");
const state_enum_1 = require("./enums/state.enum");
const trip_repository_1 = require("./trip.repository");
const trip_resume_repository_1 = require("./resumes/trip.resume.repository");
let TripService = TripService_1 = class TripService {
    constructor(tripRepository, tripResumeRepository, userService, responseHelper) {
        this.tripRepository = tripRepository;
        this.tripResumeRepository = tripResumeRepository;
        this.userService = userService;
        this.responseHelper = responseHelper;
        this.logger = new common_1.Logger(TripService_1.name);
    }
    async findByDriver(driver) {
        const trips = this.tripRepository.findByDriver(driver);
        this.logger.log(`Trips of user ${driver} founded. STATUS: SUCCESS`);
        return trips;
    }
    async findByStatus(status) {
        return this.tripRepository.find({ status });
    }
    async findNonDriverTrips(email) {
        let items = [];
        if (!email) {
            items = await this.tripRepository.findNonDriverTrips(email);
        }
        else {
            items = await this.tripRepository.find({ status: state_enum_1.TripStatus.OPEN });
        }
        if (!items.length)
            return this.responseHelper.makeResponse(false, 'Not found trips.', null, common_1.HttpStatus.NOT_FOUND);
        return this.responseHelper.makeResponse(false, 'Trips founded.', items, common_1.HttpStatus.OK);
    }
    async findById(tripId) {
        try {
            let message = 'Successfully found trips';
            let status = common_1.HttpStatus.OK;
            let trip = await this.tripRepository.findById(tripId);
            if (!trip) {
                trip = null;
                message = 'Not found trips';
                status = common_1.HttpStatus.NOT_FOUND;
                return this.responseHelper.makeResponse(false, message, {}, status);
            }
            const driver = (await this.userService.getUserData(trip.driver)).data;
            const tripData = Object.assign(Object.assign({}, trip), { driver });
            return this.responseHelper.makeResponse(false, message, tripData, status);
        }
        catch (error) {
            console.error('Error: ', error);
            return this.responseHelper.makeResponse(true, 'Error in findById', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(trip) {
        const newTrip = await this.tripRepository.create(trip);
        const message = 'Trip was created succesfully.';
        return this.responseHelper.makeResponse(false, message, newTrip, common_1.HttpStatus.CREATED);
    }
    async update(trip) {
        return this.tripRepository.update(trip);
    }
    async cancel(id, driver) {
        const trip = await this.tripRepository.findByIdAndDriver(driver, id);
        if (!trip)
            return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${driver}`, null, common_1.HttpStatus.NOT_FOUND);
        if (trip.status !== state_enum_1.TripStatus.OPEN) {
            return this.responseHelper.makeResponse(false, `Incorrect trip status: ${trip.status}`, null, common_1.HttpStatus.OK);
        }
        try {
            trip.status = state_enum_1.TripStatus.CANCELED;
            const tripUpdated = await this.tripRepository.update(trip);
            this.logger.log(`Updated trip status to ${tripUpdated.status}.`);
            return this.responseHelper.makeResponse(false, `Trip successfully cancelled : ${id}.`, tripUpdated, common_1.HttpStatus.OK);
        }
        catch (error) {
            throw error;
        }
    }
    async init(id, driver) {
        const date = new Date().toISOString();
        const trip = await this.tripRepository.findByIdAndDriver(driver, id);
        if (!trip) {
            return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${driver}.`, null, common_1.HttpStatus.NOT_FOUND);
        }
        if (trip.status !== state_enum_1.TripStatus.OPEN ||
            trip.passengers.length ||
            trip.paquetes.length) {
            return this.responseHelper.makeResponse(false, `Incorrect trip status ${trip.status} or not contain passengers and packages.`, null, common_1.HttpStatus.OK);
        }
        const resume = await this.tripResumeRepository.create({
            passengers: trip.passengers,
            startedTimestamp: new Date().toISOString(),
        });
        const resumeId = resume.id;
        this.logger.log(`Trip resume created with id ${resumeId}`);
        trip.tripResumeId = resumeId;
        trip.status = state_enum_1.TripStatus.IN_PROGRESS;
        trip.startedTimestamp = date;
        const status = (await this.tripRepository.update(trip)).status;
        this.logger.log(`Trip updated with status ${status}`);
        return this.responseHelper.makeResponse(false, `Trip successfully initialize : ${id}`, trip, common_1.HttpStatus.OK);
    }
    async finish(id, userEmail) {
        this.logger.log('Initialize process to finish trip...');
        const trip = await this.tripRepository.findById(id);
        if (!trip || trip.status !== state_enum_1.TripStatus.IN_PROGRESS)
            return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail} or status ${trip.status} not is IN PROGRESS.`, null, common_1.HttpStatus.NOT_FOUND);
        trip.status = state_enum_1.TripStatus.FINISHED;
        const status = (await this.tripRepository.update(trip)).status;
        this.logger.log(`Trip status updated to ${status}`);
        const resume = await this.tripResumeRepository.findById(trip.tripResumeId);
        resume.endedTimestamp = new Date().toISOString();
        const resumeId = (await this.tripResumeRepository.update(resume)).id;
        this.logger.log(`Trip resume ${resumeId} updated.`);
        return this.responseHelper.makeResponse(false, `Trip successfully finished : ${id}`, trip, common_1.HttpStatus.OK);
    }
    async listOfPassengers(tripId) {
        try {
            let message = 'Passengers inside the trip.';
            let status = common_1.HttpStatus.OK;
            const trip = await this.tripRepository.findById(tripId);
            if (!trip) {
                message = 'Not found trips';
                status = common_1.HttpStatus.NOT_FOUND;
                return this.responseHelper.makeResponse(false, message, null, status);
            }
            const passengers = await this.tripRepository.findPassengers(trip.passengers, ['name', 'lastName', 'email']);
            return this.responseHelper.makeResponse(false, message, passengers, status);
        }
        catch (error) {
            console.error('Error: ', error);
            return this.responseHelper.makeResponse(true, 'Error in listWithPassengers.', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
TripService = TripService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(trip_repository_1.TripRepository)),
    __param(1, (0, common_1.Inject)(trip_resume_repository_1.TripResumeRepository)),
    __param(2, (0, common_1.Inject)(user_service_1.UserService)),
    __param(3, (0, common_1.Inject)(response_helper_1.ResponseHelper)),
    __metadata("design:paramtypes", [trip_repository_1.TripRepository,
        trip_resume_repository_1.TripResumeRepository,
        user_service_1.UserService,
        response_helper_1.ResponseHelper])
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip.service.js.map