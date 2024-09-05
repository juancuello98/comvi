import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


 @ApiTags('health')
  @Post('health')
  health(): string {
    return this.appService.healthy();
  }
}
