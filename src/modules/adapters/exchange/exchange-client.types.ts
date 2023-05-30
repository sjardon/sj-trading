import { CandlestickSymbolType } from '../../candlesticks/intervals/candlestick-interval.type';
import {
  OrderPositionSide,
  OrderSide,
  OrderType,
} from '../../orders/constants/orders.enum.constant';

export enum ExchangeClientOrderSide {
  'BUY' = 'buy',
  'SELL' = 'sell',
}

export type InputExchangeClientCreateOrder = {
  symbol: CandlestickSymbolType;
  type: OrderType;
  side: ExchangeClientOrderSide;
  positionSide: OrderPositionSide;
  amount: number;
};

export type InputExchangeClientCancelOrder = {
  exchangeOrderId: string;
  symbol: CandlestickSymbolType;
};
