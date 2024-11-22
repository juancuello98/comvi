import { Test, TestingModule } from '@nestjs/testing';
import { StadisticsService } from './stadistics.service';

describe('StadisticsService', () => {
  let service: StadisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StadisticsService],
    }).compile();

    service = module.get<StadisticsService>(StadisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
