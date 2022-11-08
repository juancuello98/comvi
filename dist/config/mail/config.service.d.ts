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
    sendAcceptedRequestNotification(email: string, passengerName: string, driverName: string, origin: string, destiny: string, description: string): Promise<{
        to: string;
        subject: string;
        template: string;
        context: {
            passengerName: string;
            url: string;
            driverName: string;
            origin: string;
            destiny: string;
            description: string;
        };
    }>;
    sendRejectedRequestNotification(email: string, passengerName: string, driverName: string, origin: string, destiny: string, description: string): Promise<{
        to: string;
        subject: string;
        template: string;
        context: {
            passengerName: string;
            url: string;
            driverName: string;
            origin: string;
            destiny: string;
            description: string;
        };
    }>;
    sendCodePasswordToken(email: string, name: string, token: string): Promise<{
        to: string;
        subject: string;
        template: string;
        context: {
            name: string;
            url: string;
            token: string;
        };
    }>;
}
