import { Subject } from 'rxjs';
// import { AccountEntity } from '../../account/account.entity';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { InputGetCandlestick } from '../../candlesticks/candlestick.interface';
import { CandlestickIntervalType } from '../../candlesticks/intervals/candlestick-interval.type';
import { CandlestickSymbolType } from '../../candlesticks/symbols/candlestick-symbol.type';
// import { OrderEntity } from '../../order/order.entity';
// import { OrderPositionSide } from '../../order/position-side/order-position-side.type';
// import { OrderSide } from '../../order/side/order-side.type';

export type InputRealTimeCandlesticks = {
  symbols: CandlestickSymbolType[];
  interval: CandlestickIntervalType;
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

  // realTimeCandlestick(
  //   inputRealTimeCandlesticks: InputRealTimeCandlesticks
  // ): Subject<CandlestickEntity>; // WS

  // futuresGetAccountBalance(): Promise<AccountEntity[]>;

  futuresGetCandlesticks(
    inputGetCandlesticks: InputGetCandlestick,
  ): Promise<CandlestickEntity[]>; // futuresCandles

  // futuresRealTimeCandlesticks(
  //   inputRealTimeCandlesticks: InputRealTimeCandlesticks
  // ): Subject<CandlestickEntity>; // WS

  // futuresGetOrder(
  //   inputFuturesGetOrder: InputFuturesGetOrder
  // ): Promise<OrderEntity>; // futuresGetOrder

  // futuresGetOpenOrders(
  //   inputFuturesGetOpenOrders: InputFuturesGetOpenOrders
  // ): Promise<OrderEntity[]>; // futuresOpenOrders

  // futuresCreateOrder(
  //   inputFuturesCreateOrder: InputFuturesCreateOrder
  // ): Promise<OrderEntity>; // futuresOrder

  // futuresCancelOrder({
  //   symbol,
  //   orderId,
  // }: InputFuturesCancelOrder): Promise<OrderEntity>; // futuresCancelOrder
  // futuresAccountInfo():
}
