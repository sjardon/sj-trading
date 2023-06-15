import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { BarName } from './bar-name.enum';
import { SwingName } from './swing-name.enum';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../entities/indicator.entity';

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
    const candlesticksToCheck = candlesticks;

    let classification = candlesticksToCheck[0].isBullish()
      ? SwingName.UP_SWING
      : SwingName.DOWN_SWING;

    const classifiedCandlesticks: Array<{
      candlestick: CandlestickEntity;
      classification: SwingName;
    }> = [];
    while (candlesticksToCheck.length > 1) {
      const currentClassification =
        this.getCandlestickClassification(candlesticksToCheck);

      if (currentClassification == BarName.UP_BAR) {
        classification = SwingName.UP_SWING;
      }

      if (currentClassification == BarName.DOWN_BAR) {
        classification = SwingName.DOWN_SWING;
      }

      const { classification: lastClassification } =
        classifiedCandlesticks[classifiedCandlesticks.length - 1] || {};

      if (lastClassification && classification != lastClassification) {
        if (this.isContinuation(classifiedCandlesticks, candlesticksToCheck)) {
          classification = lastClassification;
        }
      }

      classifiedCandlesticks.push({
        candlestick: candlesticksToCheck[0],
        classification,
      });

      candlesticksToCheck.shift();
    }

    return new IndicatorEntity({
      name: this.name,
      value: classification,
    });
  };

  getCandlestickClassification = (candlesticks: CandlestickEntity[]) => {
    if (candlesticks.length >= 2) {
      if (this.isUpBar(candlesticks)) {
        return BarName.UP_BAR;
      }

      if (this.isDownBar(candlesticks)) {
        return BarName.DOWN_BAR;
      }

      if (this.isInsideBar(candlesticks)) {
        return BarName.INSIDE_BAR;
      }

      if (this.isOutsideBar(candlesticks)) {
        return BarName.OUTSIDE_BAR;
      }
    }

    return BarName.NO_CLASSIFICABLE;
  };

  isUpBar = (candlesticks: CandlestickEntity[]) => {
    const candlestick = candlesticks[1];
    const candlestickBefore = candlesticks[0];

    if (
      candlestickBefore.high < candlestick.high &&
      candlestickBefore.low < candlestick.low
    ) {
      return true;
    }

    return false;
  };

  isDownBar = (candlesticks: CandlestickEntity[]) => {
    const candlestick = candlesticks[1];
    const candlestickBefore = candlesticks[0];

    if (
      candlestickBefore.high > candlestick.high &&
      candlestickBefore.low > candlestick.low
    ) {
      return true;
    }

    return false;
  };

  isInsideBar = (candlesticks: CandlestickEntity[]) => {
    const candlestick = candlesticks[1];
    const candlestickBefore = candlesticks[0];

    if (
      candlestickBefore.high >= candlestick.high &&
      candlestickBefore.low <= candlestick.low
    ) {
      return true;
    }

    return false;
  };

  isOutsideBar = (candlesticks: CandlestickEntity[]) => {
    const candlestick = candlesticks[1];
    const candlestickBefore = candlesticks[0];

    if (
      candlestickBefore.high <= candlestick.high &&
      candlestickBefore.low >= candlestick.low
    ) {
      return true;
    }

    return false;
  };

  isContinuation = (
    classifiedCandlesticks: Array<{
      candlestick: CandlestickEntity;
      classification: SwingName;
    }>,
    candlesticksToCheck: CandlestickEntity[],
  ) => {
    if (classifiedCandlesticks.length < 1) {
      return false;
    }

    const currentCandlestick = candlesticksToCheck[0];
    let lastConfirmedCandlestick: CandlestickEntity =
      classifiedCandlesticks[0].candlestick;

    for (let i = classifiedCandlesticks.length - 1; i < 0; i--) {
      const { classification, candlestick } = classifiedCandlesticks[i];
      if (
        (classification == SwingName.UP_SWING && candlestick.isBullish()) ||
        (classification == SwingName.DOWN_SWING && candlestick.isBearish())
      ) {
        lastConfirmedCandlestick = candlestick;
        break;
      }
    }

    if (
      lastConfirmedCandlestick.isBullish() &&
      currentCandlestick.isBearish() &&
      currentCandlestick.close < lastConfirmedCandlestick.open
    ) {
      return false;
    }

    if (
      lastConfirmedCandlestick.isBearish() &&
      currentCandlestick.isBullish() &&
      currentCandlestick.close > lastConfirmedCandlestick.open
    ) {
      return false;
    }
    return true;
  };
}
