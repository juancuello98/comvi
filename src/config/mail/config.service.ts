import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
    
        
    private readonly logger = new Logger(MailService.name)
    
    constructor(
        private mailerService : MailerService,
    ) {}

    async sendCodeVerification(email: string, name: string, token: number) {
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
          }
        await this.mailerService.sendMail(mailBody);
        this.logger.log('Email enviado a:', email);
        return mailBody;
    }
}
