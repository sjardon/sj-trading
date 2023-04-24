import {
  isHight,
  isLow,
} from 'src/indicators/indicators-functions/hight-low.util';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';

import {
  IndicatorEntity,
  // IndicatorEntityConfiguration,
} from '../../entities/indicator.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';

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

    const currentClose = candlesticks[candlesticks.length - 1].close;

    for (const i in candlesticks) {
      if (isLow(candlesticks, +i, 2, 2)) {
        levels.push(candlesticks[i].low);
      }

      if (isHight(candlesticks, +i, 2, 2)) {
        levels.push(candlesticks[i].high);
      }
    }

    levels = this.removeCloses(levels);

    levels.sort();

    let currentLevel = -1;

    const currentLevelIndex = levels.findIndex(
      (level) =>
        level * (1 + this.spread) >= currentClose &&
        level * (1 - this.spread) <= currentClose,
    );

    if (currentLevelIndex > 0) {
      currentLevel = levels[currentLevelIndex];
      delete levels[currentLevelIndex];
    }

    const prevLevels = this.getPrevLevels(levels, currentClose);
    const nextLevels = this.getNextLevels(levels, currentClose);

    const taggedLevels = {
      ...prevLevels,
      currentLevel,
      ...nextLevels,
    };

    return taggedLevels;
  }

  getNextLevels(levels: number[], currentClose: number) {
    const [next, afterNext] = levels.filter((level) => currentClose < level);

    return {
      nextLevel2: afterNext ? afterNext : -1,
      nextLevel1: next ? next : -1,
    };
  }

  getPrevLevels(levels: number[], currentClose: number) {
    const [prev, beforePrev] = levels
      .filter((level) => currentClose > level)
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
