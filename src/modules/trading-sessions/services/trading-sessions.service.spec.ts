import { Test, TestingModule } from '@nestjs/testing';
import { TradingSessionsService } from './trading-sessions.service';

describe('TradingSessionsService', () => {
  let service: TradingSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingSessionsService],
    }).compile();

    service = module.get<TradingSessionsService>(TradingSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
