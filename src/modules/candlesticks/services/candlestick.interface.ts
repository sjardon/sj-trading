import { Subject } from 'rxjs';
import { CandlestickEntity } from '../entities/candlestick.entity';
import { CandlestickIntervalType } from '../constants/candlestick-interval.enum.constant';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';

type InputCandlestick = {
  interval: CandlestickIntervalType;
  lookback: number;
  startTime?: number;
  endTime?: number;
};

export type InputGetCandlestick = InputCandlestick & {
  symbol: SymbolType;
};

export type InputGetAllCurrentCandlestick = InputCandlestick & {
  symbols: SymbolType[];
};

export interface CandlestickServiceInterface {
  get(inputGetCandlestick: InputGetCandlestick): Promise<CandlestickEntity[]>;
  getAllCurrents(
    inputGetAllCurrentCandlestick: InputGetAllCurrentCandlestick,
  ): Promise<void>;
  getCandlesticksSubject(): Subject<CandlestickEntity[]>;
}
