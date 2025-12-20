import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
interface MailOptions extends nodemailer.SendMailOptions {
  template?: string;
  context?: Record<string, any>;
}
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

    constructor(
    @Inject('MAILER_TRANSPORT') private readonly transporter: nodemailer.Transporter,
  ) {}

  async sendMail(body: any): Promise<void> {
    try {
      const mailOptions : MailOptions = {
        from: '"COMVI" <noreply@comvi.com>',
        to: body.to,
        subject: body.subject,
        template: body.template,
        context: body.context,
      };
      await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado a ${body.to}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }

  async sendCode(email: string, name: string, token: string) {

    const url = process.env.URL_BUTTON;
    const mailBody = {
      to: email,
      subject: process.env.SUBJECT,
      template: 'configuration',
      context: {
        name,
        url,
        token,
      },
    };
    await this.sendMail(mailBody);
    return mailBody;
  }

  async sendAcceptedRequestNotification(
    email: string,
    passengerName: string,
    driverName: string,
    origin: string,
    destiny: string,
    description: string,
  ) {
    const url = process.env.URL_BUTTON;
    const mailBody = {
      to: email,
      subject: 'FELICIDADES! Tu solicitud ha sido aceptada.',
      template:'accepted_request',
      context: {
        passengerName: passengerName,
        url,
        driverName: driverName,
        origin: origin,
        destiny: destiny,
        description: description,
      },
    };
    await this.sendMail(mailBody);
    this.logger.log('Email enviado a:', email); // 2 logger?
    return mailBody;
  }

  async sendRejectedRequestNotification(
    email: string,
    passengerName: string,
    driverName: string,
    origin: string,
    destiny: string,
    description: string,
  ) {
    const url = process.env.URL_BUTTON;
 
    const mailBody = {
      to: email,
      subject: 'Tu solicitud ha sido rechazada.',
      template: 'rejected_request',
      context: {
        passengerName: passengerName,
        url,
        driverName: driverName,
        origin: origin,
        destiny: destiny,
        description: description,
      },
    };
    await this.sendMail(mailBody);
    this.logger.log('Email enviado a:', email); // 2 logger?
    return mailBody;
  }

  async sendCodePasswordToken(email: string, name: string, token: string) {
    const url = process.env.URL_BUTTON;

    const mailBody = {
      to: email,
      subject:
        'Hola ' + name + ' aquí está tu código para cambiar tu contraseña.',
      template: 'resetPassword',
      context: {
        name,
        url,
        token,
      },
    };
    await this.sendMail(mailBody);
    this.logger.log('Email enviado a:', email); // 2 logger?
    return mailBody;
  }
}
