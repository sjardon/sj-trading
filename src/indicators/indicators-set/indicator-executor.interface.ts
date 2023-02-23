import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from '../entities/indicator.entity';

export interface IndicatorExecutorInterface {
  exec(candlesticks: CandlestickEntity[]): IndicatorEntity;
}
