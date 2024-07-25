import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendCode(email: string, name: string, token: string) {
    // Ruta al archivo .hbs
    const templatePath = path.join(
      __dirname,
      'mail',
      'templates',
      'configuration.hbs',
    );

    // Lee el contenido del archivo .hbs como texto
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    const url = process.env.URL_BUTTON;
    const mailBody = {
      to: email,
      subject: process.env.SUBJECT,
      html: templateContent,
      context: {
        name: name,
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
    // Ruta al archivo .hbs
    const templatePath = path.join(
      __dirname,
      'mail',
      'templates',
      'accepted_request.hbs',
    );

    // Lee el contenido del archivo .hbs como texto
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const url = process.env.URL_BUTTON;
    const mailBody = {
      to: email,
      subject: 'FELICIDADES! Tu solicitud ha sido aceptada.',
      html: templateContent,
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

  async sendRejectedRequestNotification(
    email: string,
    passengerName: string,
    driverName: string,
    origin: string,
    destiny: string,
    description: string,
  ) {
    const url = process.env.URL_BUTTON;
        // Ruta al archivo .hbs
    const templatePath = path.join(
      __dirname,
      'mail',
      'templates',
      'rejected_request.hbs',
    );

    // Lee el contenido del archivo .hbs como texto
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const mailBody = {
      to: email,
      subject: 'Tu solicitud ha sido rechazada.',
      html: templateContent,
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
    const templatePath = path.join(
      __dirname,
      'mail',
      'templates',
      'resetPassword.hbs',
    );

    // Lee el contenido del archivo .hbs como texto
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const mailBody = {
      to: email,
      subject:
        'Hola ' + name + ' aquí está tu código para cambiar tu contraseña.',
      html:templateContent,
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
