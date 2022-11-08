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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const new_trip_dto_1 = require("./dto/new-trip.dto");
const trip_service_1 = require("./trip.service");
const request_helper_1 = require("../../common/helpers/http/request.helper");
let TripController = class TripController {
    constructor(tripsService, requestHelper) {
        this.tripsService = tripsService;
        this.requestHelper = requestHelper;
    }
    async create(trip, request) {
        const userEmail = this.requestHelper.getPayload(request);
        const tripModify = Object.assign(Object.assign({}, trip), { email: userEmail });
        const resp = await this.tripsService.create(tripModify);
        return resp;
    }
    async findAll(request) {
        const userEmail = this.requestHelper.getPayload(request);
        return this.tripsService.findAll(userEmail);
    }
    findOne(id) {
        return this.tripsService.findById(id);
    }
    listOfPassengers(id) {
        return this.tripsService.listOfPassengers(id);
    }
    findMyTrips(request) {
        const userEmail = this.requestHelper.getPayload(request);
        return this.tripsService.findTripsByDriver(userEmail);
    }
    async cancel(request, id) {
        const userEmail = this.requestHelper.getPayload(request);
        const resp = await this.tripsService.cancel(id, userEmail);
        return resp;
    }
    async init(request, id) {
        const userEmail = this.requestHelper.getPayload(request);
        const resp = await this.tripsService.init(id, userEmail);
        return resp;
    }
    async finish(request, id) {
        const userEmail = this.requestHelper.getPayload(request);
        const resp = await this.tripsService.finish(id, userEmail);
        return resp;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/publish'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [new_trip_dto_1.NewTripDTO, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/list/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TripController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/list/passengers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TripController.prototype, "listOfPassengers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('myTrips'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TripController.prototype, "findMyTrips", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/cancel/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "cancel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/init/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "init", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/finish/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "finish", null);
TripController = __decorate([
    (0, swagger_1.ApiTags)('trips'),
    (0, common_1.Controller)('trips'),
    __metadata("design:paramtypes", [trip_service_1.TripService,
        request_helper_1.RequestHelper])
], TripController);
exports.TripController = TripController;
//# sourceMappingURL=trip.controller.js.map