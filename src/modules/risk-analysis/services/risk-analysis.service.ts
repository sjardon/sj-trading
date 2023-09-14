import { Injectable, Logger } from '@nestjs/common';
import { BalancesService } from '../../balances/services/balances.service';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import { MarketsService } from '../../markets/services/markets.service';
import { BalanceEntity } from '../../balances/entities/balance.entity';
import { SymbolsService } from '../../../common/helpers/services/symbols/symbols.service';

export type InputRiskAnalysisAnalyze = {
  symbol: SymbolType;
};

@Injectable()
export class RiskAnalysisService {
  private startingBalance: BalanceEntity;

  private readonly logger = new Logger(RiskAnalysisService.name);

  constructor(
    private symbolsService: SymbolsService,
    private balancesService: BalancesService,
    private marketsService: MarketsService,
  ) {}

  async analyze(symbol: SymbolType) {
    // TODO: Add a balances array for differents tradingSessions

    const quoteSymbol = this.symbolsService.getQuoteStockSymbol(symbol);
    const currentBalance = await this.balancesService.getByStockSymbol(
      quoteSymbol,
    );

    if (!this.startingBalance) {
      this.startingBalance = currentBalance;
    }

    const { total: totalStartedAcount } = this.startingBalance;
    const { total: totalCurrentAcount } = this.startingBalance;

    if (totalCurrentAcount / totalStartedAcount <= 0.8) {
      return false;
    }

    return true;
  }

  async getAmount(symbol: SymbolType): Promise<number> {
    // TODO: Probably this logic should be in other service
    const quoteSymbol = this.symbolsService.getQuoteStockSymbol(symbol);
    const currentBalance = await this.balancesService.getByStockSymbol(
      quoteSymbol,
    );
    const currentPrice = await this.marketsService.getPrice(symbol);
    const { free: accountAmount } = currentBalance;

    return (accountAmount * 0.2) / currentPrice;
  }
}
