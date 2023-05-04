import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatisticsService } from './services/statistics.service';
import { StatisticsController } from './controllers/statistics.controller';
import { BacktestOperationsModule } from '../backtests/backtest-operations/backtest-operations.module';
import { BacktestTimeframesModule } from '../backtests/backtest-timeframe/backtest-timeframes.module';
import { BacktestStatisticEntity } from './entities/statistic.entity';

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
