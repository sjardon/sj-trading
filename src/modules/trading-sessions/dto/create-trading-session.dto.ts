import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CandlestickIntervalType } from '../../candlesticks/constants/candlestick-interval.enum.constant';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';

export class CreateTradingSessionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsUUID()
  strategyId: string;

  @IsEnum(SymbolType)
  symbol: SymbolType;

  @IsEnum(CandlestickIntervalType)
  interval: CandlestickIntervalType;
}
