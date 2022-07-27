import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
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
