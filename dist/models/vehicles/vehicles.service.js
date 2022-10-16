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
var VehiclesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const vehicles_schema_1 = require("./vehicles.schema");
const user_service_1 = require("../users/user.service");
const mongoose_2 = require("@nestjs/mongoose");
let VehiclesService = VehiclesService_1 = class VehiclesService {
    constructor(vehiclesModel, userService) {
        this.vehiclesModel = vehiclesModel;
        this.userService = userService;
        this.logger = new common_1.Logger(VehiclesService_1.name);
    }
    async create(createVehicleDto) {
        const newVehicle = new this.vehiclesModel(createVehicleDto);
        const user = await this.userService.findByEmail(createVehicleDto.mail);
        const doesUserExist = !!user;
        if (!doesUserExist) {
            this.logger.log('El usuario no existe: ' + createVehicleDto.mail);
            return null;
        }
        return newVehicle.save();
    }
    async update(id, updateVehicleDto) {
        const vehicle = new this.vehiclesModel(updateVehicleDto);
        return vehicle.save();
    }
};
VehiclesService = VehiclesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(vehicles_schema_1.Vehicles.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService])
], VehiclesService);
exports.VehiclesService = VehiclesService;
//# sourceMappingURL=vehicles.service.js.map