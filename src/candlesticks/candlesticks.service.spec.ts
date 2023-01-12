import { Test, TestingModule } from '@nestjs/testing';
import { CandlesticksService } from './candlesticks.service';

describe('CandlesticksService', () => {
  let service: CandlesticksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandlesticksService],
    }).compile();

    service = module.get<CandlesticksService>(CandlesticksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
