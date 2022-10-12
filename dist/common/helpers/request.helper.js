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
exports.RequestHelper = void 0;
const common_1 = require("@nestjs/common");
const jwt_decode_1 = require("jwt-decode");
let RequestHelper = class RequestHelper {
    constructor() {
        this.getPayload = (request) => {
            let auth;
            let token;
            let email = '';
            const req = request;
            const head = req.headers;
            if (head.authorization) {
                auth = head.authorization;
                token = auth.split(' ')[1];
                const payload = (0, jwt_decode_1.default)(token);
                email = payload.user.email;
            }
            return email;
        };
    }
};
RequestHelper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RequestHelper);
exports.RequestHelper = RequestHelper;
//# sourceMappingURL=request.helper.js.map