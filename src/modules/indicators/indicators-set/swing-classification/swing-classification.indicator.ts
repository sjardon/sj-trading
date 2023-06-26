import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { BarName } from './bar-name.enum';
import { SwingName } from './swing-name.enum';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../entities/indicator.entity';
import { isHight, isLow } from '../../indicators-functions/hight-low.util';
import { SMA } from '../../indicators-functions/sma.util';

export type InputCandlesticksPatternIndicator = {
  lookback: number;
  threshold: number;
};

export type CandlesticksPatternIndicatorType = {
  name: string;
  value: SwingName;
};

export class SwingClassificationExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;
  threshold: number;

  constructor(
    name: string,
    inputCandlesticksPatternIndicator: InputCandlesticksPatternIndicator,
  ) {
    const { lookback, threshold } = inputCandlesticksPatternIndicator;

    this.name = name || 'SWING_CLASSIFICATION';
    this.lookback = lookback || 20;
    this.threshold = threshold || 0.005;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    // let classification = this.clasifyFromSmas(candlesticks);
    let classification = this.clasifyFromSma(candlesticks);

    return new IndicatorEntity({
      name: this.name,
      value: classification,
    });
  };

  clasifyFromSma(candlesticks: CandlestickEntity[]) {
    const { open, close } = candlesticks[candlesticks.length - 1];
    const openCloseMax = Math.max(open, close);
    const openCloseMin = Math.min(open, close);

    const highs = candlesticks.map((candlestick) => candlestick.high);
    const lows = candlesticks.map((candlestick) => candlestick.low);

    const SMA_HIGH = SMA(highs, 20);
    const SMA_LOW = SMA(lows, 20);

    if (
      (SMA_HIGH > openCloseMin && SMA_HIGH < openCloseMax) ||
      (SMA_LOW > openCloseMin && SMA_LOW < openCloseMax)
    ) {
      return SwingName.CONSOLIDATION;
    }

    if (SMA_HIGH < openCloseMin) {
      return SwingName.UP_SWING;
    }

    if (SMA_LOW > openCloseMax) {
      return SwingName.DOWN_SWING;
    }

    return SwingName.UNKNOWN;
  }
}
