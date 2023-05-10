import { Module } from '@nestjs/common';
import { TradingSessionsService } from './services/trading-sessions.service';
import { TradingSessionsController } from './controllers/trading-sessions.controller';
import { TradingSessionEntity } from './entities/trading-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategiesModule } from '../strategies/strategies.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [TradingSessionsController],
  providers: [TradingSessionsService],
  imports: [
    TypeOrmModule.forFeature([TradingSessionEntity]),
    StrategiesModule,
    CqrsModule,
  ],
})
export class TradingSessionsModule {}
