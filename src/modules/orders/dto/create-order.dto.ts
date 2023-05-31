import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import {
  OrderPositionSide,
  OrderSide,
  OrderType,
} from '../constants/orders.enum.constant';

export class CreateOrderDto {
  symbol: SymbolType;
  type?: OrderType;
  side: OrderSide;
  positionSide?: OrderPositionSide;
  amount: number;
}
