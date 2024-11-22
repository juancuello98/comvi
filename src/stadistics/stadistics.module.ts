import { Module } from '@nestjs/common';
import { StadisticsService } from './stadistics.service';
import { StadisticsController } from './stadistics.controller';

@Module({
  controllers: [StadisticsController],
  providers: [StadisticsService]
})
export class StadisticsModule {}
