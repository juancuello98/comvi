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
exports.ValuationsController = void 0;
const common_1 = require("@nestjs/common");
const valuations_service_1 = require("./valuations.service");
const create_valuation_dto_1 = require("./dto/create-valuation.dto");
const express_1 = require("express");
const request_helper_1 = require("../../common/helpers/http/request.helper");
let ValuationsController = class ValuationsController {
    constructor(valuationsService, requestHelper) {
        this.valuationsService = valuationsService;
        this.requestHelper = requestHelper;
    }
    async create(createValuationDto) {
        const userEmail = this.requestHelper.getPayload(express_1.request);
        const valuationModify = Object.assign({}, createValuationDto);
        await this.valuationsService.create(valuationModify);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_valuation_dto_1.CreateValuationDto]),
    __metadata("design:returntype", Promise)
], ValuationsController.prototype, "create", null);
ValuationsController = __decorate([
    (0, common_1.Controller)('valuations'),
    __metadata("design:paramtypes", [valuations_service_1.ValuationsService, request_helper_1.RequestHelper])
], ValuationsController);
exports.ValuationsController = ValuationsController;
//# sourceMappingURL=valuations.controller.js.map