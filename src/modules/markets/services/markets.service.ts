import { ExchangeClient } from '../../adapters/exchange/exchange.client';
import { Injectable, Logger } from '@nestjs/common';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';

@Injectable()
export class MarketsService {
  private readonly logger = new Logger(MarketsService.name);

  constructor(private exchangeClient: ExchangeClient) {}

  async getPrice(symbol: SymbolType): Promise<number> {
    const orderBook = await this.exchangeClient.getOrderBook(symbol);
    const [bid] = orderBook.bids[0];
    const [ask] = orderBook.asks[0];

    return (ask + bid) / 2;
  }
}
