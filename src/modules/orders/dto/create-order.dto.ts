import { CandlestickSymbolType } from 'src/modules/candlesticks/intervals/candlestick-interval.type';
import {
  OrderPositionSide,
  OrderSide,
  OrderType,
} from '../constants/orders.enum.constant';

export type CreateOrderDto = {
  symbol: CandlestickSymbolType;
  type?: OrderType;
  side: OrderSide;
  positionSide?: OrderPositionSide;
  amount: number;
};
