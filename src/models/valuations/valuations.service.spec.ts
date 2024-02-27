import { Test, TestingModule } from '@nestjs/testing';
import { ValuationsService } from './valuations.service';

describe('ValuationsService', () => {
  let service: ValuationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValuationsService],
    }).compile();

    service = module.get<ValuationsService>(ValuationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
