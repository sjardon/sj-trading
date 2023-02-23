import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradersModule } from './traders/traders.module';
import { TradingSessionsModule } from './trading-sessions/trading-sessions.module';
import { AccountsModule } from './accounts/accounts.module';
import { OperationsModule } from './operations/operations.module';
import { CandlesticksModule } from './candlesticks/candlesticks.module';
import { BacktestsModule } from './backtests/backtests.module';
import { AdaptersModule } from './adapters/adapters.module';
import { AnalyzersService } from './analyzers/analyzers.service';
import { StrategiesModule } from './strategies/strategies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyEntity } from './strategies/entities/strategy.entity';
import { BacktestEntity } from './backtests/entities/backtest.entity';
import { AnalyzersModule } from './analyzers/analyzers.module';
import { BacktestOrderEntity } from './backtests/backtest-orders/entities/backtest-order.entity';
import { BacktestOperationEntity } from './backtests/backtest-operations/entities/backtest-operation.entity';
import { IndicatorsModule } from './indicators/indicators.module';
import { IndicatorEntity } from './indicators/entities/indicator.entity';
import { CandlestickEntity } from './candlesticks/entities/candlestick.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'trading',
      // entities: [
      //   CandlestickEntity,
      //   IndicatorEntity,
      //   StrategyEntity,
      //   BacktestEntity,
      //   BacktestOrderEntity,
      //   BacktestOperationEntity,
      // ],
      autoLoadEntities: true,
      synchronize: true,
    }),

    TradersModule,
    TradingSessionsModule,
    AccountsModule,
    OperationsModule,
    BacktestsModule,
    AdaptersModule,
    StrategiesModule,
    AnalyzersModule,
    CandlesticksModule,
    IndicatorsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AnalyzersService],
})
export class AppModule {}
