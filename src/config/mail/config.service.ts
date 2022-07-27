import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        private mailerService : MailerService,
        private readonly logger = new Logger(MailService.name)
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
