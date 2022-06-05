import { Controller, Get , Post, Body} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('holaMundo')
  getHello(): Object {
    return this.appService.getHello();
  }

}
