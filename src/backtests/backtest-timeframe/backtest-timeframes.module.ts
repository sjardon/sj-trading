import { Module } from '@nestjs/common';
import { BacktestTimeframesService } from './backtest-timeframes.service';
import { CandlesticksModule } from 'src/candlesticks/candlesticks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestTimeframeEntity } from './entities/backtest-timeframe.entity';

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
