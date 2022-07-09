import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private mailerService : MailerService
    ) {}

    async sendCodeVerification(email: string, name: string, token: number) {
        const url = `http://www.google.com/`;
        const mailBody = {
            to: email,
            subject: 'Bienvenido a COMVI! Estas a un paso de empezar a disfrutar! ',
            template: './verificationCode.hbs',
            context: {
              name: name,
              url,
              token,

            },
          }
        await this.mailerService.sendMail(mailBody);
        return mailBody;
    }
}
