import { Module } from '@nestjs/common';
import { CandlesticksModule } from '../candlesticks/candlesticks.module';
import { BacktestsService } from './services/backtests.service';
import { BacktestsController } from './controllers/backtests.controller';
import { StrategiesModule } from '../strategies/strategies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestEntity } from './entities/backtest.entity';
import { BacktestOrdersModule } from './backtest-orders/backtest-orders.module';
import { AnalyzersModule } from '../analyzers/analyzers.module';
import { BacktestOperationsModule } from './backtest-operations/backtest-operations.module';
import { BacktestTimeframesModule } from './backtest-timeframe/backtest-timeframes.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  providers: [BacktestsService],
  imports: [
    TypeOrmModule.forFeature([BacktestEntity]),
    CandlesticksModule,
    StrategiesModule,
    AnalyzersModule,
    BacktestOrdersModule,
    BacktestOperationsModule,
    BacktestTimeframesModule,
    StatisticsModule,
  ],
  controllers: [BacktestsController],
})
export class BacktestsModule {}
