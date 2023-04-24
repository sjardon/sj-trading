import { Test, TestingModule } from '@nestjs/testing';
import { BacktestTimeframesService } from './backtest-timeframes.service';

describe('BacktestTimeframeService', () => {
  let service: BacktestTimeframesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacktestTimeframesService],
    }).compile();

    service = module.get<BacktestTimeframesService>(BacktestTimeframesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
