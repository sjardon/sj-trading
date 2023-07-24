import { SymbolsService } from './../../../common/helpers/services/symbols/symbols.service';
import { Injectable } from '@nestjs/common';
import { ExchangeClient } from '../../adapters/exchange/exchange.client';
import { StockSymbolType } from '../../../common/helpers/services/symbols/constants/stock-symbol.enum.constant';

@Injectable()
export class BalancesService {
  constructor(private exchangeClient: ExchangeClient) {}

  async watch() {
    return await this.exchangeClient.watchBalances();
  }

  async get() {
    return await this.exchangeClient.getBalances();
  }

  async getByStockSymbol(symbol: StockSymbolType) {
    const balances = await this.exchangeClient.getBalances();
    const filteredBalance = balances.find(
      (balance) => balance.stockSymbol == symbol,
    );

    if (!filteredBalance) {
      throw new Error(`Could not get balance for [${symbol}] symbol`);
    }

    return filteredBalance;
  }
}
