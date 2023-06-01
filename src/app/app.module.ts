import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradingSessionsModule } from '../modules/trading-sessions/trading-sessions.module';
import { OperationsModule } from '../modules/operations/operations.module';
import { CandlesticksModule } from '../modules/candlesticks/candlesticks.module';
import { BacktestsModule } from '../modules/backtests/backtests.module';
import { AdaptersModule } from '../modules/adapters/adapters.module';
import { AnalyzersService } from '../modules/analyzers/analyzers.service';
import { StrategiesModule } from '../modules/strategies/strategies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzersModule } from '../modules/analyzers/analyzers.module';
import { IndicatorsModule } from '../modules/indicators/indicators.module';
import { StatisticsModule } from '../modules/statistics/statistics.module';
import { AuthModule } from '../modules/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs';
import { RiskAnalysisModule } from 'src/modules/risk-analysis/risk-analysis.module';

@Module({
  imports: [
    CommonModule,
    TradingSessionsModule,
    OperationsModule,
    BacktestsModule,
    AdaptersModule,
    StrategiesModule,
    AnalyzersModule,
    RiskAnalysisModule,
    CandlesticksModule,
    IndicatorsModule,
    StatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AnalyzersService],
})
export class AppModule {}
