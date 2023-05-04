import { Module } from '@nestjs/common';
import { TradingSessionsService } from './services/trading-sessions.service';
import { TradingSessionsController } from './controllers/trading-sessions.controller';
import { TradingSessionEntity } from './entities/trading-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TradingSessionsController],
  providers: [TradingSessionsService],
  imports: [TypeOrmModule.forFeature([TradingSessionEntity])],
})
export class TradingSessionsModule {}
