import { Module } from '@nestjs/common';
import { StadisticsService } from './stadistics.service';
import { StadisticsController } from './stadistics.controller';
import { TripModule } from 'src/models';

@Module({
  imports: [TripModule],
  controllers: [StadisticsController],
  providers: [StadisticsService]
})
export class StadisticsModule {}
