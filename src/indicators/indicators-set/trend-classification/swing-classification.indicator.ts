import { CandlestickEntity } from 'src/candlesticks/entities/candlestick.entity';
import { SwingName } from './swing-name.enum';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from 'src/indicators/entities/indicator.entity';
import { SMA } from 'src/indicators/indicators-functions/sma.util';
import {
  isHight,
  isLow,
} from 'src/indicators/indicators-functions/hight-low.util';

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

    for (const i in candlesticks) {
      if (isHight(candlesticks, +i, 2, 2)) {
        points.push({
          type: 'high',
          value: candlesticks[i].high,
        });
      } else if (isLow(candlesticks, +i, 2, 2)) {
        points.push({
          type: 'low',
          value: candlesticks[i].low,
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
