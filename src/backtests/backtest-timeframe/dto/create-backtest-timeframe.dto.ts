import { BacktestEntity } from 'src/backtests/entities/backtest.entity';
import { CandlestickEntity } from 'src/candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from 'src/indicators/entities/indicator.entity';

export class CreateBacktestTimeframeDto {
  backtest: BacktestEntity;
  candlestick: CandlestickEntity;
  indicators: IndicatorEntity[];
}
