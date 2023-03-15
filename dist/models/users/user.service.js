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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_helper_1 = require("../../common/helpers/http/response.helper");
const user_schema_1 = require("../users/user.schema");
let UserService = class UserService {
    constructor(userModel, responseHelper) {
        this.userModel = userModel;
        this.responseHelper = responseHelper;
    }
    _getUserDetails(user) {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email
        };
    }
    _getUserValidatedOK(user) {
        return {
            id: user._id,
            email: user.email,
            validated: true
        };
    }
    _getUserValidatedFAIL(user) {
        return {
            id: user._id,
            email: user.email,
            validated: false
        };
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async getUserData(email) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                return this.responseHelper.makeResponse(false, 'User not found.', null, common_1.HttpStatus.NOT_FOUND);
            }
            const userData = {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                trips: user.trips,
                packages: user.packages,
                tripsFavourites: user.tripsFavourites,
                subscribedTrips: user.subscribedTrips,
                tripsCreated: user.tripsCreated,
                joinRequests: user.joinRequests
            };
            return this.responseHelper.makeResponse(false, 'User data successfully found.', userData, common_1.HttpStatus.OK);
        }
        catch (error) {
            return this.responseHelper.makeResponse(true, 'Error recovering user data.', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user)
            return null;
        return this._getUserDetails(user);
    }
    async create(name, email, hashedPassword, lastname, validated, verificationCode) {
        const newUser = new this.userModel({
            name,
            email,
            password: hashedPassword,
            lastname,
            validated,
            verificationCode,
        });
        return newUser.save();
    }
    async update(user) {
        return user.save();
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        response_helper_1.ResponseHelper])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map