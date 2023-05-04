import { Test, TestingModule } from '@nestjs/testing';
import { BacktestOperationsController } from './backtest-operations.controller';
import { BacktestOperationsService } from './backtest-operations.service';

describe('BacktestOperationsController', () => {
  let controller: BacktestOperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BacktestOperationsController],
      providers: [BacktestOperationsService],
    }).compile();

    controller = module.get<BacktestOperationsController>(BacktestOperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
