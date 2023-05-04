import { Test, TestingModule } from '@nestjs/testing';
import { BacktestOrdersService } from './backtest-orders.service';

describe('BacktestOrdersService', () => {
  let service: BacktestOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacktestOrdersService],
    }).compile();

    service = module.get<BacktestOrdersService>(BacktestOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
