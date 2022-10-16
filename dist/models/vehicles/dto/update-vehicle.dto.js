"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vehicle_dto_1 = require("./create-vehicle.dto");
class UpdateVehicleDto extends (0, mapped_types_1.PartialType)(create_vehicle_dto_1.CreateVehicleDto) {
}
exports.UpdateVehicleDto = UpdateVehicleDto;
//# sourceMappingURL=update-vehicle.dto.js.map