import { Test, TestingModule } from '@nestjs/testing';
import { BacktestsController } from './backtests.controller';

describe('BacktestsController', () => {
  let controller: BacktestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BacktestsController],
    }).compile();

    controller = module.get<BacktestsController>(BacktestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
