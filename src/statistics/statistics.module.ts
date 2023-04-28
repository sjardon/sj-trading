import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { BacktestsModule } from 'src/backtests/backtests.module';
import { BacktestOperationsModule } from 'src/backtests/backtest-operations/backtest-operations.module';
import { BacktestTimeframesModule } from 'src/backtests/backtest-timeframe/backtest-timeframes.module';
import { BacktestStatisticEntity } from './entities/statistic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    TypeOrmModule.forFeature([BacktestStatisticEntity]),
    BacktestOperationsModule,
    BacktestTimeframesModule,
  ],
  exports: [StatisticsService],
})
export class StatisticsModule {}
