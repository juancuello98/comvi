import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '@/users/user.service';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
  private readonly userService: UserService,
  ) {
  }

  async sendNotification(tokens: string[],  message: { title: string; body: string; data?: { [key: string]: string } } ) {
    try {
      const responses = [];
      tokens.forEach(async (token) => {
      const response = await admin.messaging().send({
        token,
        notification: {
          title: message.title,
          body: message.body,
        },
        data: message.data, 
      });
      console.log('Notification sent successfully:', response);
      responses.push(response);});

    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async addToken(mail:string ,token: string) {
    try {
      this.userService.addToken(mail,token);
      await admin.messaging().subscribeToTopic(token, 'all');
      console.log('Token added successfully:', token);
    } catch (error) {
      console.error('Error adding token:', error);
      throw error;
    }
  }
}
