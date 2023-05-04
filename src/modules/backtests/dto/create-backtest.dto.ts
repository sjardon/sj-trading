import { Type } from 'class-transformer';
import { CandlestickIntervalType } from '../../candlesticks/intervals/candlestick-interval.type';
import { CandlestickSymbolType } from '../../candlesticks/symbols/candlestick-symbol.type';

export class CreateBacktestDto {
  name: string;

  strategyId?: string;

  symbol: CandlestickSymbolType;

  interval?: CandlestickIntervalType;

  @Type(() => Date)
  // @Transform(({ obj }) => new Date(obj))
  startTime?: Date;

  @Type(() => Date)
  // @Transform(({ obj }) => new Date(obj))
  endTime?: Date;
}
