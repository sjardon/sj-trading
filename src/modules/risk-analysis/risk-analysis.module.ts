import { Module } from '@nestjs/common';
import { RiskAnalysisService } from './services/risk-analysis.service';
import { BalancesModule } from '../balances/balances.module';
import { MarketsModule } from '../markets/markets.module';

@Module({
  providers: [RiskAnalysisService],
  exports: [RiskAnalysisService],
  imports: [BalancesModule, MarketsModule],
})
export class RiskAnalysisModule {}
