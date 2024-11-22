import { Test, TestingModule } from '@nestjs/testing';
import { StadisticsController } from './stadistics.controller';
import { StadisticsService } from './stadistics.service';

describe('StadisticsController', () => {
  let controller: StadisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StadisticsController],
      providers: [StadisticsService],
    }).compile();

    controller = module.get<StadisticsController>(StadisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
