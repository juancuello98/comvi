import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
export declare class MailService {
    private mailerService;
    private readonly logger;
    constructor(mailerService: MailerService, logger?: Logger);
    sendCodeVerification(email: string, name: string, token: number): Promise<{
        to: string;
        subject: string;
        template: string;
        context: {
            name: string;
            url: string;
            token: number;
        };
    }>;
}
