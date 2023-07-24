import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';

export class BalanceEntity {
  stockSymbol: string;
  free: number;
  used: number;
  total: number;
  datetime?: string;
}
