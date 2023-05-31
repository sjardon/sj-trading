import { Type } from 'class-transformer';
import { CandlestickIntervalType } from '../../candlesticks/constants/candlestick-interval.enum.constant';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';

export class CreateBacktestDto {
  name: string;

  strategyId?: string;

  symbol: SymbolType;

  interval?: CandlestickIntervalType;

  @Type(() => Date)
  // @Transform(({ obj }) => new Date(obj))
  startTime?: Date;

  @Type(() => Date)
  // @Transform(({ obj }) => new Date(obj))
  endTime?: Date;
}
