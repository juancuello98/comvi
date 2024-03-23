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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRequestDTO = void 0;
const decorators_1 = require("@nestjs/swagger/dist/decorators");
const class_validator_1 = require("class-validator");
class ActionRequestDTO {
}
__decorate([
    (0, decorators_1.ApiProperty)({
        description: 'id del viaje que de la solicitud',
        name: 'tripId',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActionRequestDTO.prototype, "tripId", void 0);
__decorate([
    (0, decorators_1.ApiProperty)({
        description: 'id de la solicitud a la cual se va a responder',
        name: 'requestId',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ActionRequestDTO.prototype, "requestId", void 0);
exports.ActionRequestDTO = ActionRequestDTO;
//# sourceMappingURL=action-request.dto.js.map