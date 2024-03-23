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
exports.UserService = void 0;
const response_helper_1 = require("../../common/helpers/http/response.helper");
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./user.repository");
let UserService = class UserService {
    constructor(userRepository, responseHelper) {
        this.userRepository = userRepository;
        this.responseHelper = responseHelper;
    }
    async update(user) {
        return this.userRepository.update(user);
    }
    async findByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        return user;
    }
    getUser({ id, name, lastname, email }) {
        return {
            id,
            name,
            lastname,
            email,
        };
    }
    async getUserData(email) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return this.responseHelper.makeResponse(false, 'User not found.', null, common_1.HttpStatus.NOT_FOUND);
            }
            const { name, lastname, trips, packages, tripsFavourites, subscribedTrips, tripsCreated, joinRequests, } = user;
            const userData = {
                name,
                lastname,
                email,
                trips,
                packages,
                tripsFavourites,
                subscribedTrips,
                tripsCreated,
                joinRequests,
            };
            return this.responseHelper.makeResponse(false, 'User data successfully found.', userData, common_1.HttpStatus.OK);
        }
        catch (error) {
            return this.responseHelper.makeResponse(true, 'Error recovering user data.', null, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user)
            return null;
        return this.getUser(user);
    }
    async create(name, email, hashedPassword, lastname, validated, verificationCode) {
        const user = {
            name,
            email,
            hashedPassword,
            lastname,
            validated,
            verificationCode,
        };
        return this.userRepository.create(user);
    }
    async updateUserRequests(email, requestId) {
        await this.userRepository.createRequest(email, requestId);
    }
    async getUsers(ids) {
        const users = this.userRepository.findUsersById(ids, [
            'name',
            'lastName',
            'email',
        ]);
        return users;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        response_helper_1.ResponseHelper])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map