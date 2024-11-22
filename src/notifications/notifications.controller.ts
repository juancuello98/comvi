import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { RequestHelper } from '../common/helpers/http/request.helper';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('events')
export class EventController {
  constructor(
    private readonly notificationHandler: NotificationsService,
    private readonly requestHelper: RequestHelper // Add this line
  ) {}

  @Post('notify')
  async notify(@Body() body: {tokens: string[],  message: { title: string; body: string; data?: { [key: string]: string }}}) {
    await this.notificationHandler.sendNotification(body.tokens, body.message);
    return { message: 'Notification sent!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('addTokken')
  async init(@Request() req, @Param('token') token: string): Promise<object> {
    const mail = this.requestHelper.getPayload(req);
    await this.notificationHandler.addToken(mail, token);
    return { message: 'Notification sent!' };
  }
}
