import { Test, TestingModule } from '@nestjs/testing';
import { BacktestOrdersController } from './backtest-orders.controller';
import { BacktestOrdersService } from './backtest-orders.service';

describe('BacktestOrdersController', () => {
  let controller: BacktestOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BacktestOrdersController],
      providers: [BacktestOrdersService],
    }).compile();

    controller = module.get<BacktestOrdersController>(BacktestOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
