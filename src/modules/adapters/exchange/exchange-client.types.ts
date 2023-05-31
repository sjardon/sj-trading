import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
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
  symbol: SymbolType;
  type: OrderType;
  side: ExchangeClientOrderSide;
  positionSide: OrderPositionSide;
  amount: number;
};

export type InputExchangeClientCancelOrder = {
  exchangeOrderId: string;
  symbol: SymbolType;
};
