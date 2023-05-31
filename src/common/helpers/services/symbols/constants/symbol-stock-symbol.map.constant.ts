import { StockSymbolType } from './stock-symbol.enum.constant';
import { SymbolType } from './symbol.enum.constant';

export const baseSymbolStockSymbolMap = {
  [SymbolType.BTCUSDT]: StockSymbolType.BTC,
};

export const quoteSymbolStockSymbolMap = {
  [SymbolType.BTCUSDT]: StockSymbolType.USDT,
};
