import { Test, TestingModule } from '@nestjs/testing';
import { TravellingController } from './travelling.controller';
import { TravellingService } from './travelling.service';

describe('TravellingController', () => {
  let controller: TravellingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravellingController],
      providers: [TravellingService],
    }).compile();

    controller = module.get<TravellingController>(TravellingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
