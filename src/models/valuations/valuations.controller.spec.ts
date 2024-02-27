import { Test, TestingModule } from '@nestjs/testing';
import { ValuationsController } from './valuations.controller';
import { ValuationsService } from './valuations.service';

describe('ValuationsController', () => {
  let controller: ValuationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValuationsController],
      providers: [ValuationsService],
    }).compile();

    controller = module.get<ValuationsController>(ValuationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
