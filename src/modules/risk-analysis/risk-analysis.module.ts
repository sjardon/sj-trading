import { Module } from '@nestjs/common';
import { RiskAnalysisService } from './services/risk-analysis.service';
import { BalancesModule } from '../balances/balances.module';
import { MarketsModule } from '../markets/markets.module';
import { HelpersModule } from '../../common/helpers/helpers.module';

@Module({
  providers: [RiskAnalysisService],
  exports: [RiskAnalysisService],
  imports: [BalancesModule, MarketsModule, HelpersModule],
})
export class RiskAnalysisModule {}
