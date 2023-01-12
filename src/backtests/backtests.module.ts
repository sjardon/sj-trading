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

@Module({
  providers: [BacktestsService],
  imports: [
    TypeOrmModule.forFeature([BacktestEntity]),
    CandlesticksModule,
    StrategiesModule,
    AnalyzersModule,
    BacktestOrdersModule,
    BacktestOperationsModule,
  ],
  controllers: [BacktestsController],
})
export class BacktestsModule {}
