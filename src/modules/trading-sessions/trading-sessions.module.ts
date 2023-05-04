import { Module } from '@nestjs/common';
import { TradingSessionsService } from './services/trading-sessions.service';
import { TradingSessionsController } from './controllers/trading-sessions.controller';

@Module({
  controllers: [TradingSessionsController],
  providers: [TradingSessionsService]
})
export class TradingSessionsModule {}
