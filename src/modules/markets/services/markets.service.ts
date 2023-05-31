import { ExchangeClient } from 'src/modules/adapters/exchange/exchange.client';
import { Injectable } from '@nestjs/common';
import { SymbolType } from 'src/common/helpers/services/symbols/constants/symbol.enum.constant';

@Injectable()
export class MarketsService {
  constructor(private exchangeClient: ExchangeClient) {}

  async getPrice(symbol: SymbolType): Promise<number> {
    const ticker = await this.exchangeClient.getTicker(symbol);
    const { ask, bid } = ticker;
    return (ask + bid) / 2;
  }
}
