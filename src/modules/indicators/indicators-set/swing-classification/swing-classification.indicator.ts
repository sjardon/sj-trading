import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { BarName } from './bar-name.enum';
import { SwingName } from './swing-name.enum';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../entities/indicator.entity';
import { isHight, isLow } from '../../indicators-functions/hight-low.util';
import { SMA } from '../../indicators-functions/sma.util';

export type InputCandlesticksPatternIndicator = {
  lookback: number;
};

export type CandlesticksPatternIndicatorType = {
  name: string;
  value: SwingName;
};

export class SwingClassificationExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;

  constructor(
    name: string,
    inputCandlesticksPatternIndicator: InputCandlesticksPatternIndicator,
  ) {
    const { lookback } = inputCandlesticksPatternIndicator;

    this.name = name || 'SWING_CLASSIFICATION';
    this.lookback = lookback || 20;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    const lowsSma = this.getLowsSma(candlesticks);
    const highsSma = this.getHighsSma(candlesticks);

    const lows = [];
    const highs = [];

    for (let i = 0; i < highsSma.length; i++) {
      if (isLow(lowsSma, +i, 2, 2)) {
        lows.push(candlesticks[i + 2]);
      }

      if (isHight(highsSma, +i, 2, 2)) {
        highs.push(candlesticks[i + 2]);
      }
    }

    
    // return new IndicatorEntity({
    //   name: this.name,
    //   value: classification,
    // });
  };

  getHighsSma(candlesticks: CandlestickEntity[]) {
    const highs = candlesticks.map((candlestick) => candlestick.high);
    const highsSma: number[] = [];

    for (let i = 3; i < highs.length; i++) {
      highsSma.push(SMA(highs.slice(i - 3, i), 3));
    }

    return highsSma;
  }

  getLowsSma(candlesticks: CandlestickEntity[]) {
    const lows = candlesticks.map((candlestick) => candlestick.low);
    const lowsSma: number[] = [];

    for (let i = 3; i < lows.length; i++) {
      lowsSma.push(SMA(lows.slice(i - 3, i), 3));
    }

    return lowsSma;
  }
}
