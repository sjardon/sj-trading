import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestTimeframeEntity } from './entities/backtest-timeframe.entity';
import { BacktestTimeframesService } from './backtest-timeframes.service';
import { CandlesticksModule } from '../../candlesticks/candlesticks.module';

@Module({
  providers: [BacktestTimeframesService],
  imports: [
    TypeOrmModule.forFeature([BacktestTimeframeEntity]),
    CandlesticksModule,
  ],
  exports: [BacktestTimeframesService],
})
export class BacktestTimeframesModule {}
// BacktestTimeframeEntity
