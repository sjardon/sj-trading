import { Module } from '@nestjs/common';
import { CandlesticksModule } from '../candlesticks/candlesticks.module';
import { BacktestsService } from './backtests.service';
import { BacktestsController } from './backtests.controller';
import { StrategiesModule } from 'src/strategies/strategies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestEntity } from './entities/backtest.entity';
import { BacktestOrdersModule } from './backtest-orders/backtest-orders.module';
import { AnalyzersModule } from 'src/analyzers/analyzers.module';
import { BacktestOperationsModule } from './backtest-operations/backtest-operations.module';
import { BacktestCandlestickService } from './services/backtest-candlestick.service';
import { BacktestCandlestickView } from './entities/backtest-candlestick.entity';
import { BacktestProfitView } from './entities/backtest-profit.entity';
import { BacktestTimeframesModule } from './backtest-timeframe/backtest-timeframes.module';
import { StatisticsModule } from 'src/statistics/statistics.module';

@Module({
  providers: [BacktestsService, BacktestCandlestickService],
  imports: [
    TypeOrmModule.forFeature([
      BacktestEntity,
      BacktestProfitView,
      BacktestCandlestickView,
    ]),
    CandlesticksModule,
    StrategiesModule,
    AnalyzersModule,
    BacktestOrdersModule,
    BacktestOperationsModule,
    BacktestTimeframesModule,
    StatisticsModule,
  ],
  controllers: [BacktestsController],
  exports: [BacktestCandlestickService],
})
export class BacktestsModule {}
