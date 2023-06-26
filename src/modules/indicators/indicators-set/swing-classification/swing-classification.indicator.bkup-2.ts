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
    let classification = SwingName.UNKNOWN;

    candlesticks = candlesticks.slice(candlesticks.length - this.lookback);

    const lowsSma = this.getLowsSma(candlesticks);
    const highsSma = this.getHighsSma(candlesticks);

    const lows: number[] = [];
    const highs: number[] = [];

    for (let i = 0; i < highsSma.length; i++) {
      if (isLow(lowsSma, +i, 2, 2)) {
        lows.push(lowsSma[i]);
      }

      if (isHight(highsSma, +i, 2, 2)) {
        highs.push(highsSma[i]);
      }
    }

    classification = this.clasifyFromHighsLows(highs, lows);

    // const lastXYHighs = highs
    //   .splice(highs.length - 2, highs.length)
    //   .map((candlestick) => [candlestick.closeTime, candlestick.high]);
    // const lastXYLows = lows
    //   .splice(lows.length - 2, lows.length)
    //   .map((candlestick) => [candlestick.closeTime, candlestick.high]);
    // const highSlope = this.getPercentageSlope(lastXYHighs);
    // const lowSlope = this.getPercentageSlope(lastXYLows);
    // classification = this.clasifyFromSlopes(highSlope, lowSlope);

    return new IndicatorEntity({
      name: this.name,
      value: classification,
    });
  };

  private getPercentageSlope(values: number[][]) {
    const [[x0, y0], [x1, y1]] = values;
    const slope = (y1 - y0) / (x1 - x0);
    // const independentTerm = y0 - slope * x0;

    // Calculate the angle in radians
    const angleRadians = Math.atan(slope);

    // Convert radians to degrees
    const angleDegrees = angleRadians * (180 / Math.PI);

    // Calculate the percentage of 360 degrees
    return angleDegrees / 360;
  }

  private getHighsSma(candlesticks: CandlestickEntity[]) {
    const highs = candlesticks.map((candlestick) => candlestick.high);
    const highsSma: number[] = [];

    for (let i = 3; i < highs.length; i++) {
      highsSma.push(SMA(highs.slice(i - 3, i), 3));
    }

    return highsSma;
  }

  private getLowsSma(candlesticks: CandlestickEntity[]) {
    const lows = candlesticks.map((candlestick) => candlestick.low);
    const lowsSma: number[] = [];

    for (let i = 3; i < lows.length; i++) {
      lowsSma.push(SMA(lows.slice(i - 3, i), 3));
    }

    return lowsSma;
  }

  clasifyFromSmas(candlesticks: CandlestickEntity[]) {
    const closes = candlesticks.map((candlestick) => candlestick.close);
    const SMA_180 = SMA(closes, 180);
    const SMA_20 = SMA(closes, 50);
    const SMA_8 = SMA(closes, 10);

    if (SMA_180 < SMA_20 && SMA_20 < SMA_8) {
      return SwingName.UP_SWING;
    }

    if (SMA_180 > SMA_20 && SMA_20 > SMA_8) {
      return SwingName.DOWN_SWING;
    }

    return SwingName.UNKNOWN;
  }

  private clasifyFromHighsLows(highs: number[], lows: number[]) {
    if (highs.length >= 2 && lows.length >= 2) {
      highs = this.removeCloses(highs);
      lows = this.removeCloses(lows);

      if (this.isConsolidation(highs, lows)) {
        return SwingName.CONSOLIDATION;
      }

      if (this.isUpTrend(highs, lows)) {
        return SwingName.UP_SWING;
      }

      if (this.isDownTrend(highs, lows)) {
        return SwingName.DOWN_SWING;
      }
    }

    return SwingName.UNKNOWN;
  }

  private isConsolidation(highs: number[], lows: number[]) {
    if (highs.length >= 2 && lows.length >= 2) {
      return false;
    }

    return true;
  }

  private removeCloses(values: number[]) {
    return values.filter((currentValue, currentIndex) => {
      const closeIndex = values.findIndex(
        (foundLevel) =>
          currentValue * (1 + this.threshold) >= foundLevel &&
          currentValue * (1 - this.threshold) <= foundLevel,
      );

      if (closeIndex >= 0 && closeIndex != currentIndex) {
        return false;
      }

      return true;
    });
  }

  private isUpTrend(highs: number[], lows: number[]) {
    const [h1, h2] = highs.slice(highs.length - 2);
    const [l1, l2] = lows.slice(lows.length - 2);

    if (h1 < h2 && l1 < l2) {
      return true;
    }

    return false;
  }

  private isDownTrend(highs: number[], lows: number[]) {
    const [h1, h2] = highs.slice(highs.length - 2);
    const [l1, l2] = lows.slice(lows.length - 2);

    if (h1 > h2 && l1 > l2) {
      return true;
    }

    return false;
  }

  private clasifyFromSlopes(highSlope: number, lowSlope: number) {
    if (highSlope > 0 && lowSlope > 0) {
      return SwingName.UP_SWING;
    }

    if (highSlope < 0 && lowSlope < 0) {
      return SwingName.DOWN_SWING;
    }

    return SwingName.CONSOLIDATION;
  }
}
