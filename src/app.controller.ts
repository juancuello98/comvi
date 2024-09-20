import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


 @ApiTags('health')
 @ApiOperation({ summary: 'Check health service.' })
  @Post('health')
  health(): string {
    return this.appService.healthy();
  }
}
