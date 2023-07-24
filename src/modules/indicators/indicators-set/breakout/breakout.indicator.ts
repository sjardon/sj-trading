import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../entities/indicator.entity';
import { CurrentSupportResistanceExecutor } from '../current-support-resistance/current-support-resistance.executor';

export class BreakoutExecutor extends CurrentSupportResistanceExecutor {
  name: string;
  lookback: number;

  constructor(
    name: string,
    inputBreakoutConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    let { lookback } = inputBreakoutConfiguration;
    lookback = lookback || 6;

    super(name || 'BREAKOUT', { lookback, spread: 0.005 });
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    try {
      candlesticks = candlesticks.slice(candlesticks.length - this.lookback);
      const levels = this.getTaggedLevels(candlesticks);

      let isBullishBreakout = false;
      let isBearishBreakout = false;

      isBullishBreakout = this.isBullishBreakoutChannel(candlesticks);

      if (
        levels.prevLevel1 > 0 &&
        levels.currentLevel < 0 &&
        !isBullishBreakout
      ) {
        isBullishBreakout = this.isBullishBreakout(candlesticks, levels);
      }

      isBearishBreakout = this.isBearishBreakoutChannel(candlesticks);

      if (
        levels.nextLevel1 > 0 &&
        levels.currentLevel < 0 &&
        !isBearishBreakout
      ) {
        isBearishBreakout = this.isBearishBreakout(candlesticks, levels);
      }

      return new IndicatorEntity({
        name: this.name,
        children: [
          new IndicatorEntity({
            name: 'BREAKOUT_BULLISH',
            value: isBullishBreakout,
          }),
          new IndicatorEntity({
            name: 'BREAKOUT_BEARISH',
            value: isBearishBreakout,
          }),
        ],
      });
    } catch (e) {
      throw e;
    }
  };

  isBigCandle(candlesticks: CandlestickEntity[]) {
    const prevCandlesticks = candlesticks.slice(candlesticks.length - 5);
    const currentCandlestick = prevCandlesticks.pop();
    const currentChange = currentCandlestick.change();

    const meanChange =
      prevCandlesticks
        .map((candlestick) => candlestick.change())
        .reduce((prev, current) => prev + current, 0) / prevCandlesticks.length;

    if (meanChange * 1.01 < currentChange) {
      return true;
    }

    return false;
  }

  isBullishBreakout(candlesticks: CandlestickEntity[], levels) {
    const currentCandlestick = candlesticks[candlesticks.length - 1];

    if (currentCandlestick.isBearish()) {
      return false;
    }
    const testInCandlesticks = candlesticks.slice(
      candlesticks.length - 5,
      candlesticks.length - 1,
    );
    return testInCandlesticks.some((candlestick) => {
      const maxOpenClose = Math.max(candlestick.open, candlestick.close);

      if (maxOpenClose < levels.prevLevel1) {
        return true;
      }

      return false;
    });
  }

  isBullishBreakoutChannel(candlesticks: CandlestickEntity[]): boolean {
    const [prevCandlestick, currentCandlestick] = candlesticks.slice(
      candlesticks.length - 2,
    );

    if (currentCandlestick.isBearish()) {
      return false;
    }

    const toTestCandlesticks = candlesticks.slice(
      candlesticks.length - 30,
      candlesticks.length - 2,
    );

    const highs = toTestCandlesticks.map((candlestick) => candlestick.high);

    const max = Math.max(...highs);

    if (
      max < prevCandlestick.close &&
      max < currentCandlestick.open &&
      max < currentCandlestick.close &&
      currentCandlestick.isBullish()
    ) {
      return true;
    }

    return false;
  }

  isBearishBreakoutChannel(candlesticks: CandlestickEntity[]): boolean {
    const [prevCandlestick, currentCandlestick] = candlesticks.slice(
      candlesticks.length - 2,
    );

    if (currentCandlestick.isBullish()) {
      return false;
    }

    const toTestCandlesticks = candlesticks.slice(
      candlesticks.length - 30,
      candlesticks.length - 2,
    );

    const lows = toTestCandlesticks.map((candlestick) => candlestick.low);

    const min = Math.min(...lows);

    if (
      min > prevCandlestick.close &&
      min > currentCandlestick.open &&
      min > currentCandlestick.close &&
      currentCandlestick.isBearish()
    ) {
      return true;
    }

    return false;
  }

  isBearishBreakout(candlesticks: CandlestickEntity[], levels) {
    const currentCandlestick = candlesticks[candlesticks.length - 1];

    if (currentCandlestick.isBullish()) {
      return false;
    }

    return candlesticks
      .slice(candlesticks.length - 5, candlesticks.length - 1)
      .some((candlestick) => {
        const minOpenClose = Math.min(candlestick.open, candlestick.close);

        if (minOpenClose > levels.nextLevel1) {
          return true;
        }

        return false;
      });
  }
}
