import { Test, TestingModule } from '@nestjs/testing';
import { BacktestsService } from './backtests.service';

describe('BacktestsService', () => {
  let service: BacktestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacktestsService],
    }).compile();

    service = module.get<BacktestsService>(BacktestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
