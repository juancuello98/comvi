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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let MailService = MailService_1 = class MailService {
    constructor(mailerService, logger = new common_1.Logger(MailService_1.name)) {
        this.mailerService = mailerService;
        this.logger = logger;
    }
    async sendCodeVerification(email, name, token) {
        const url = process.env.URL_BUTTON;
        const mailBody = {
            to: email,
            subject: process.env.SUBJECT,
            template: './configuration.hbs',
            context: {
                name: name,
                url,
                token,
            },
        };
        await this.mailerService.sendMail(mailBody);
        this.logger.log('Email enviado a:', email);
        return mailBody;
    }
};
MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService, Object])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=config.service.js.map