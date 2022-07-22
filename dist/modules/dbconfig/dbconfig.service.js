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
exports.TypeOrmService = exports.MongoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("../dbconfig/schemas");
let MongoService = class MongoService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async updateItem(condition, value) {
        const document_updated = this.userModel.findOneAndUpdate(condition, value);
        return document_updated;
    }
    async checkExistOneInUsers(condition) {
        const resp = this.userModel.exists(condition);
        return resp;
    }
    async userFindOne(condition) {
        const resp = await this.userModel.findOne(condition);
        return resp;
    }
    async createOneUser(newUser) {
        const created = this.userModel.create(newUser);
        return created;
    }
};
MongoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoService);
exports.MongoService = MongoService;
let TypeOrmService = class TypeOrmService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    updateItem(value, condition) {
        throw new Error('Method not implemented.');
    }
    async checkExistOneInUsers(condition) {
        const resp = this.userModel.exists(condition);
        return resp;
    }
    async userFindOne(condition) {
        const resp = await this.userModel.findOne(condition);
        return resp;
    }
    async createOneUser(newUser) {
        const created = this.userModel.create(newUser);
        return created;
    }
};
TypeOrmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TypeOrmService);
exports.TypeOrmService = TypeOrmService;
//# sourceMappingURL=dbconfig.service.js.map