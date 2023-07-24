import { isHight, isLow } from '../../indicators-functions/hight-low.util';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';

import {
  IndicatorEntity,
  // IndicatorEntityConfiguration,
} from '../../entities/indicator.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { SMA } from '../../indicators-functions/sma.util';

export class CurrentSupportResistanceExecutor
  implements IndicatorExecutorInterface
{
  name: string;
  lookback: number;
  spread: number;

  constructor(
    name: string,
    inputCurrentSupportResistanceIndicatorConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    const { lookback, spread } =
      inputCurrentSupportResistanceIndicatorConfiguration;

    this.name = name || 'CURRENT_SUPPORT_RESISTANCE';
    this.lookback = lookback || 30;
    this.spread = spread;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    try {
      if (candlesticks.length < this.lookback) {
        throw new Error(
          `There are not enough candlesticks. Required: ${this.lookback} - Current: ${candlesticks.length}`,
        );
      }

      candlesticks = candlesticks.slice(candlesticks.length - this.lookback);

      const levels = this.getTaggedLevels(candlesticks);

      return new IndicatorEntity({
        name: this.name,
        children: [
          new IndicatorEntity({
            name: 'PREV_LEVEL_2',
            value: levels.prevLevel2,
          }),
          new IndicatorEntity({
            name: 'PREV_LEVEL_1',
            value: levels.prevLevel1,
          }),
          new IndicatorEntity({
            name: 'CURRENT_LEVEL',
            value: levels.currentLevel,
          }),
          new IndicatorEntity({
            name: 'NEXT_LEVEL_1',
            value: levels.nextLevel1,
          }),
          new IndicatorEntity({
            name: 'NEXT_LEVEL_2',
            value: levels.nextLevel2,
          }),
        ],
      });
    } catch (error) {
      // console.log('error:', error);
      throw error;
    }
  };

  getTaggedLevels(candlesticks: CandlestickEntity[]) {
    let levels: number[] = [];

    const {
      close: currentClose,
      high: currentHigh,
      low: currentLow,
    } = candlesticks[candlesticks.length - 1];

    const lowsSma = this.getLowsSma(candlesticks);

    const highsSma = this.getHighsSma(candlesticks);
    const highs = candlesticks.map((candlestick) => candlestick.high);

    const lows = candlesticks.map((candlestick) => candlestick.low);

    for (const i in highs) {
      if (isHight(highs, +i, 2, 2)) {
        levels.push(highs[i]);
      }
    }

    for (const i in lows) {
      if (isLow(lows, +i, 2, 2)) {
        levels.push(lows[i]);
      }
    }

    // for (const i in highsSma) {
    //   if (isHight(highsSma, +i, 2, 2)) {
    //     levels.push(highsSma[i]);
    //   }
    // }

    // for (const i in lowsSma) {
    //   if (isLow(lowsSma, +i, 2, 2)) {
    //     levels.push(lowsSma[i]);
    //   }
    // }

    let currentLevel = -1;

    const currentLevelIndex = levels.findIndex((level) => {
      const isCurrentLevel = level >= currentLow && level <= currentHigh;
      return isCurrentLevel;
    });

    if (currentLevelIndex > 0) {
      currentLevel = levels[currentLevelIndex];
      levels = levels.filter(
        (level) => !(level <= currentHigh && level >= currentLow),
      );
    }

    levels = this.removeCloses(levels);

    levels.sort();

    const prevLevels = this.getPrevLevels(
      levels,
      candlesticks[candlesticks.length - 1],
    );
    const nextLevels = this.getNextLevels(
      levels,
      candlesticks[candlesticks.length - 1],
    );

    const taggedLevels = {
      ...prevLevels,
      currentLevel,
      ...nextLevels,
    };

    return taggedLevels;
  }

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

  getNextLevels(levels: number[], { open, close }: CandlestickEntity) {
    const maxOpenClose = Math.max(open, close);

    const [next, afterNext] = levels.filter((level) => maxOpenClose < level);

    return {
      nextLevel2: afterNext ? afterNext : -1,
      nextLevel1: next ? next : -1,
    };
  }

  getPrevLevels(levels: number[], { open, close }: CandlestickEntity) {
    const minOpenClose = Math.min(open, close);
    const [prev, beforePrev] = levels
      .filter((level) => minOpenClose > level)
      .reverse();

    return {
      prevLevel2: beforePrev ? beforePrev : -1,
      prevLevel1: prev ? prev : -1,
    };
  }

  removeCloses(levels: number[]) {
    return levels.filter((currentLevel, currentIndex) => {
      const closeIndex = levels.findIndex(
        (foundLevel) =>
          currentLevel * (1 + this.spread) >= foundLevel &&
          currentLevel * (1 - this.spread) <= foundLevel,
      );

      if (closeIndex >= 0 && closeIndex != currentIndex) {
        return false;
      }

      return true;
    });
  }

  // isClose(level,currentLevel)
}
