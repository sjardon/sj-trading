import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { SwingName } from './swing-name.enum';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../../indicators/entities/indicator.entity';
import { SMA } from '../../indicators-functions/sma.util';
import { isHight, isLow } from '../../indicators-functions/hight-low.util';

export type InputCandlesticksPatternIndicator = {
  lookback: number;
};

type PointType = {
  type: 'high' | 'low';
  value: number;
};

export class SwingClassificationExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;

  constructor(
    name: string,
    inputCandlesticksPatternIndicator: InputCandlesticksPatternIndicator,
  ) {
    const { lookback } = inputCandlesticksPatternIndicator;

    this.name = name || 'TREND_CLASSIFICATION';
    this.lookback = lookback || 20;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    candlesticks = candlesticks.slice(candlesticks.length - this.lookback);

    const points: PointType[] = [];

    const highs = candlesticks.map((candlestick) => candlestick.high);
    const lows = candlesticks.map((candlestick) => candlestick.low);

    for (const i in highs) {
      if (isHight(highs, +i, 2, 2)) {
        points.push({
          type: 'high',
          value: highs[i],
        });
      } else if (isLow(lows, +i, 2, 2)) {
        points.push({
          type: 'low',
          value: lows[i],
        });
      }
    }

    const current = points[points.length - 1];
    const prev = points[points.length - 2];
    const prev_1 = points[points.length - 3];
    const prev_2 = points[points.length - 4];

    if (
      current.type == 'high' &&
      prev.type == 'low' &&
      prev_1.type == 'high' &&
      prev_2.type == 'low'
    ) {
    }
    return new IndicatorEntity({
      name: this.name,
      // value: classification,
    });
  };
}
