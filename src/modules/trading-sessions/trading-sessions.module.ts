import { Module } from '@nestjs/common';
import { TradingSessionsService } from './services/trading-sessions.service';
import { TradingSessionsController } from './controllers/trading-sessions.controller';
import { TradingSessionEntity } from './entities/trading-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategiesModule } from '../strategies/strategies.module';

@Module({
  controllers: [TradingSessionsController],
  providers: [TradingSessionsService],
  imports: [TypeOrmModule.forFeature([TradingSessionEntity]), StrategiesModule],
})
export class TradingSessionsModule {}
