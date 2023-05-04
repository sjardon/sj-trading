import { BacktestEntity } from '../../entities/backtest.entity';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from '../../../indicators/entities/indicator.entity';

export class CreateBacktestTimeframeDto {
  backtest: BacktestEntity;
  candlestick: CandlestickEntity;
  indicators: IndicatorEntity[];
}
