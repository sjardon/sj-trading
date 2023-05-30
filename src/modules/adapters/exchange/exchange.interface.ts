import { Subject } from 'rxjs';
// import { AccountEntity } from '../../account/account.entity';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { InputGetCandlestick } from '../../candlesticks/services/candlestick.interface';
import { CandlestickIntervalType } from '../../candlesticks/intervals/candlestick-interval.type';
import { CandlestickSymbolType } from '../../candlesticks/symbols/candlestick-symbol.type';
import { OrderEntity } from 'src/modules/orders/entities/order.entity';
import {
  InputExchangeClientCancelOrder,
  InputExchangeClientCreateOrder,
} from './exchange-client.types';
// import { OrderEntity } from '../../order/order.entity';
// import { OrderPositionSide } from '../../order/position-side/order-position-side.type';
// import { OrderSide } from '../../order/side/order-side.type';

export type InputWatchCandlesticks = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
  lookback: number;
};

export type InputFuturesGetOrder = {
  symbol: CandlestickSymbolType;
  orderId: number;
};

export type InputFuturesGetOpenOrders = { symbol: CandlestickSymbolType };

// export type InputFuturesCreateOrder = {
//   symbol: CandlestickSymbolType;
//   side: OrderSide;
//   positionSide: OrderPositionSide;
//   quantity: number;
//   stopLoss?: number;
// };

export type InputFuturesCancelOrder = {
  symbol: CandlestickSymbolType;
  orderId: number;
};

export interface ExchangeInterface {
  getCandlesticks(
    inputGetCandlesticks: InputGetCandlestick,
  ): Promise<CandlestickEntity[]>; // candles

  futuresGetCandlesticks(
    inputGetCandlesticks: InputGetCandlestick,
  ): Promise<CandlestickEntity[]>; // futuresCandles

  futuresWatchCandlesticks(
    inputWatchCandlesticks: InputWatchCandlesticks,
  ): Promise<CandlestickEntity[]>;

  createOrder({
    symbol,
    type,
    side,
    amount,
  }: InputExchangeClientCreateOrder): Promise<OrderEntity>; // futuresOrder

  cancelOrder({
    exchangeOrderId,
    symbol,
  }: InputExchangeClientCancelOrder): Promise<OrderEntity>;
}
