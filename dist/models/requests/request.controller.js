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
exports.RequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const request_helper_1 = require("../../common/helpers/http/request.helper");
const request_service_1 = require("./request.service");
const new_request_dto_1 = require("./dto/new-request.dto");
const transaction_service_1 = require("../transactions/transaction.service");
let RequestController = class RequestController {
    constructor(requestService, requestHelper, transaction) {
        this.requestService = requestService;
        this.requestHelper = requestHelper;
        this.transaction = transaction;
    }
    async create(tripRequest, request) {
        const userEmail = this.requestHelper.getPayload(request);
        const requestUpdated = Object.assign(Object.assign({}, tripRequest), { email: userEmail });
        const resp = await this.requestService.send(requestUpdated);
        if (!resp.hasError)
            this.transaction.processSendRequest(resp.data, userEmail);
        return resp;
    }
    async findMyRequests(request) {
        const userEmail = this.requestHelper.getPayload(request);
        return this.requestService.findMyRequests(userEmail);
    }
    async requestsByTrips(request) {
        const userEmail = this.requestHelper.getPayload(request);
        return this.requestService.requestsByTrips(userEmail);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/send'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [new_request_dto_1.NewRequestDTO, Object]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/myrequests'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "findMyRequests", null);
__decorate([
    (0, common_1.Get)('/requestsBytrips'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "requestsByTrips", null);
RequestController = __decorate([
    (0, swagger_1.ApiTags)('request'),
    (0, common_1.Controller)('request'),
    __metadata("design:paramtypes", [request_service_1.RequestService,
        request_helper_1.RequestHelper,
        transaction_service_1.TransactionService])
], RequestController);
exports.RequestController = RequestController;
//# sourceMappingURL=request.controller.js.map