import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

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
    await this.mailerService.sendMail(mailBody);
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
    await this.mailerService.sendMail(mailBody);
    this.logger.log('Email enviado a:', email); // 2 logger?
    return mailBody;
  }

  async sendNewRequestNotification(
    email: string,
    passengerName: string,
    driverName: string,
    origin: string,
    destiny: string,
    description: string,
  ) {
    const url = process.env.URL_BUTTON;
    const mailBodySended = {
      to: email,
      subject: 'UN LLAMADO A LA AVENTURA! Tu solicitud ha sido enviada con exito.',
      template:'new_requestSended',
      context: {
        passengerName: passengerName,
        url,
        driverName: driverName,
        origin: origin,
        destiny: destiny,
        description: description,
      },
    };
    await this.mailerService.sendMail(mailBodySended);
    this.logger.log('Email enviado a:', email); // 2 logger?

    const mailBodyReceived = {
      to: driverName,
      subject: 'NUEVA SOLICITUD DE VIAJE!',
      template:'new_requestReceived',
      context: {
        passengerName: passengerName,
        url,
        driverName: driverName,
        origin: origin,
        destiny: destiny,
        description: description,
      },
    };
    const result = {
      mailBodySended,
      mailBodyReceived,
    }
    return result;
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
    await this.mailerService.sendMail(mailBody);
    this.logger.log('Email enviado a:', email); // 2 logger?
    return mailBody;
  }
  

  async sendCanceledRequestNotification(
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
      subject: 'Tu solicitud ha sido cancelada.',
      template: 'canceled_request',
      context: {
        passengerName: passengerName,
        url,
        driverName: driverName,
        origin: origin,
        destiny: destiny,
        description: description,
      },
    };
    await this.mailerService.sendMail(mailBody);
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
    await this.mailerService.sendMail(mailBody);
    this.logger.log('Email enviado a:', email); // 2 logger?
    return mailBody;
  }

  
}
