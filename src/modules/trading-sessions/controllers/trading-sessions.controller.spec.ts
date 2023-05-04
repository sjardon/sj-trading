import { Test, TestingModule } from '@nestjs/testing';
import { TradingSessionsController } from './trading-sessions.controller';
import { TradingSessionsService } from '../services/trading-sessions.service';

describe('TradingSessionsController', () => {
  let controller: TradingSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingSessionsController],
      providers: [TradingSessionsService],
    }).compile();

    controller = module.get<TradingSessionsController>(TradingSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
