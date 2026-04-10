import { Test, TestingModule } from '@nestjs/testing';
import { TravellingService } from './travelling.service';

describe('TravellingService', () => {
  let service: TravellingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravellingService],
    }).compile();

    service = module.get<TravellingService>(TravellingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
