import { Injectable } from '@nestjs/common';
import { SymbolType } from '../../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import { StockSymbolType } from './constants/stock-symbol.enum.constant';
import {
  baseSymbolStockSymbolMap,
  quoteSymbolStockSymbolMap,
} from './constants/symbol-stock-symbol.map.constant';

@Injectable()
export class SymbolsService {
  getBaseStockSymbol(symbol: SymbolType): StockSymbolType {
    if (!SymbolType[symbol]) {
      throw new Error(`Could not get base stock symbol from [${symbol}]`);
    }

    return baseSymbolStockSymbolMap[SymbolType[symbol]];
  }

  getQuoteStockSymbol(symbol: SymbolType): StockSymbolType {
    if (!SymbolType[symbol]) {
      throw new Error(`Could not get quote stock symbol from [${symbol}]`);
    }

    return quoteSymbolStockSymbolMap[SymbolType[symbol]];
  }
}
