import { Controller, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('root')
  @ApiOperation({ summary: 'API root endpoint.' })
  @Get()
  getHello(): string {
    return 'COMVI API is running!';
  }

 @ApiTags('health')
 @ApiOperation({ summary: 'Check health service.' })
  @Post('health')
  health(): string {
    return this.appService.healthy();
  }
}
