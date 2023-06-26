import { CandlestickEntity } from 'src/modules/candlesticks/entities/candlestick.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../entities/indicator.entity';
import { CurrentSupportResistanceExecutor } from '../current-support-resistance/current-support-resistance.executor';

export class BreackoutExecutor extends CurrentSupportResistanceExecutor {
  name: string;
  lookback: number;

  constructor(
    name: string,
    inputBreackoutConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    let { lookback } = inputBreackoutConfiguration;
    lookback = lookback || 6;

    super(name || 'BREACKOUT', { lookback, spread: 0.005 });
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    const levels = this.getTaggedLevels(candlesticks);

    let isBullishBreackout = false;
    let isBearishBreackout = false;

    // if (this.isBigCandle(candlesticks)) {
    if (levels.prevLevel1 > 0 && levels.currentLevel < 0) {
      isBullishBreackout = this.isBullishBreackout(candlesticks, levels);
    }

    if (levels.nextLevel1 > 0 && levels.currentLevel < 0) {
      isBearishBreackout = this.isBearishBreackout(candlesticks, levels);
    }
    // }
    return new IndicatorEntity({
      name: this.name,
      children: [
        new IndicatorEntity({
          name: 'BREACKOUT_BULLISH',
          value: isBullishBreackout,
        }),
        new IndicatorEntity({
          name: 'BREACKOUT_BEARISH',
          value: isBearishBreackout,
        }),
      ],
    });
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

  isBullishBreackout(candlesticks: CandlestickEntity[], levels) {
    const currentCandlestick = candlesticks[candlesticks.length - 1];

    if (currentCandlestick.isBearish()) {
      return false;
    }

    return candlesticks
      .slice(candlesticks.length - 5, candlesticks.length - 1)
      .some((candlestick) => {
        const maxOpenClose = Math.max(candlestick.open, candlestick.close);

        if (maxOpenClose < levels.prevLevel1) {
          return true;
        }

        return false;
      });
  }

  isBearishBreackout(candlesticks: CandlestickEntity[], levels) {
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
