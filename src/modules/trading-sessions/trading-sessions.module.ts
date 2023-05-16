import { Module } from '@nestjs/common';
import { TradingSessionsService } from './services/trading-sessions.service';
import { TradingSessionsController } from './controllers/trading-sessions.controller';
import { TradingSessionEntity } from './entities/trading-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategiesModule } from '../strategies/strategies.module';
import { CqrsModule } from '@nestjs/cqrs';

import { StartTradingSessionHandler } from './events/handlers/start-trading-session.handler';
import { CreateTradingSessionHandler } from './commands/handlers/create-trading-session.handler';
import { HelpersModule } from '../../common/helpers/helpers.module';
import { CandlesticksModule } from '../candlesticks/candlesticks.module';
import { TickTradingSessionHandler } from './commands/handlers/tick-trading-session.handler';

@Module({
  controllers: [TradingSessionsController],
  providers: [
    TradingSessionsService,
    StartTradingSessionHandler,
    CreateTradingSessionHandler,
    TickTradingSessionHandler,
  ],
  imports: [
    TypeOrmModule.forFeature([TradingSessionEntity]),
    CandlesticksModule,
    StrategiesModule,
    CqrsModule,
    HelpersModule,
  ],
})
export class TradingSessionsModule {}
