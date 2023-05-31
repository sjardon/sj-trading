import { Subject } from 'rxjs';
// import { AccountEntity } from '../../account/account.entity';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { InputGetCandlestick } from '../../candlesticks/services/candlestick.interface';
import { CandlestickIntervalType } from '../../candlesticks/constants/candlestick-interval.enum.constant';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import { OrderEntity } from 'src/modules/orders/entities/order.entity';
import {
  InputExchangeClientCancelOrder,
  InputExchangeClientCreateOrder,
} from './exchange-client.types';
// import { OrderEntity } from '../../order/order.entity';
// import { OrderPositionSide } from '../../order/position-side/order-position-side.type';
// import { OrderSide } from '../../order/side/order-side.type';

export type InputWatchCandlesticks = {
  symbol: SymbolType;
  interval: CandlestickIntervalType;
  lookback: number;
};

export type InputFuturesGetOrder = {
  symbol: SymbolType;
  orderId: number;
};

export type InputFuturesGetOpenOrders = { symbol: SymbolType };

// export type InputFuturesCreateOrder = {
//   symbol: SymbolType;
//   side: OrderSide;
//   positionSide: OrderPositionSide;
//   quantity: number;
//   stopLoss?: number;
// };

export type InputFuturesCancelOrder = {
  symbol: SymbolType;
  orderId: number;
};

export interface ExchangeInterface {
  // getCandlesticks(
  //   inputGetCandlesticks: InputGetCandlestick,
  // ): Promise<CandlestickEntity[]>; // candles

  futuresGetCandlesticks(
    inputGetCandlesticks: InputGetCandlestick,
  ): Promise<CandlestickEntity[]>; // futuresCandles

  futuresWatchCandlesticks(
    inputWatchCandlesticks: InputWatchCandlesticks,
  ): Promise<CandlestickEntity[]>;

  watchBalances(): Promise<any>;

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
