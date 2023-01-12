import { Test, TestingModule } from '@nestjs/testing';
import { BacktestOperationsService } from './backtest-operations.service';

describe('BacktestOperationsService', () => {
  let service: BacktestOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacktestOperationsService],
    }).compile();

    service = module.get<BacktestOperationsService>(BacktestOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
