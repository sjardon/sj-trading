import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  CandlestickIntervalType,
  CandlestickSymbolType,
} from 'src/modules/candlesticks/intervals/candlestick-interval.type';

export class CreateTradingSessionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsUUID()
  strategyId: string;

  @IsEnum(CandlestickSymbolType)
  symbol: CandlestickSymbolType;

  @IsEnum(CandlestickIntervalType)
  interval: CandlestickIntervalType;
}
