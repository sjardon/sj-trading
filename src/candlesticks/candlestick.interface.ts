import { Subject } from 'rxjs';
import { CandlestickEntity } from './entities/candlestick.entity';
import { CandlestickIntervalType } from './intervals/candlestick-interval.type';
import { CandlestickSymbolType } from './symbols/candlestick-symbol.type';

type InputCandlestick = {
  interval: CandlestickIntervalType;
  lookback: number;
  startTime?: number;
  endTime?: number;
};

export type InputGetCandlestick = InputCandlestick & {
  symbol: CandlestickSymbolType;
};

export type InputGetAllCurrentCandlestick = InputCandlestick & {
  symbols: CandlestickSymbolType[];
};

export interface CandlestickServiceInterface {
  get(inputGetCandlestick: InputGetCandlestick): Promise<CandlestickEntity[]>;
  getAllCurrents(
    inputGetAllCurrentCandlestick: InputGetAllCurrentCandlestick,
  ): Promise<void>;
  getCandlesticksSubject(): Subject<CandlestickEntity[]>;
}
