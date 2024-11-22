import { Controller } from '@nestjs/common';
import { StadisticsService } from './stadistics.service';

@Controller('stadistics')
export class StadisticsController {
  constructor(private readonly stadisticsService: StadisticsService) {}
}
