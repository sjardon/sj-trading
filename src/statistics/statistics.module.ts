import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { BacktestsModule } from 'src/backtests/backtests.module';
import { BacktestOperationsModule } from 'src/backtests/backtest-operations/backtest-operations.module';
import { BacktestTimeframesModule } from 'src/backtests/backtest-timeframe/backtest-timeframes.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    BacktestsModule,
    BacktestOperationsModule,
    BacktestTimeframesModule,
  ],
})
export class StatisticsModule {}
