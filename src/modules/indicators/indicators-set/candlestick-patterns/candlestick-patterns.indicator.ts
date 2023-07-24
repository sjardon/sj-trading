import {
  isEngulfingBullish,
  isEngulfingBearish,
  isMorningStar,
  isEveningStar,
  isHammer,
  isInvertedHammer,
  isHangingMan,
  isEveningStarDoji,
  isMorningStarDoji,
  isPinBarBullish,
  isPinBarBearish,
  isTwoBearishCandles,
  isTwoBullishCandles,
} from '../../indicators-functions/candlestick-patterns.util';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from '../../entities/indicator.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';

const candlestickPatterns = {
  ENGULFING_BULLISH: isEngulfingBullish,
  ENGULFING_BEARISH: isEngulfingBearish,
  MORNING_STAR: isMorningStar,
  MORNING_STAR_DOJI: isMorningStarDoji,
  EVENING_STAR: isEveningStar,
  EVENING_STAR_DOJI: isEveningStarDoji,
  HAMMER: isHammer,
  INVERTED_HAMMER: isInvertedHammer,
  HANGING_MAN: isHangingMan,
  PIN_BAR_BULLISH: isPinBarBullish,
  PIN_BAR_BEARISH: isPinBarBearish,
  TWO_BULLISH_CANDLES: isTwoBullishCandles,
  TWO_BEARISH_CANDLES: isTwoBearishCandles,
};

export class CandlestickPatternsExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;
  findIn: boolean;

  constructor(
    name: string,
    inputCandlestickPatternConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    const { lookback, findIn } = inputCandlestickPatternConfiguration;

    this.name = name || 'CANDLESTICK_PATTERNS';
    this.lookback = lookback || 6;
    this.findIn = findIn || false;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    if (candlesticks.length < this.lookback) {
      throw new Error(
        `There are not enough candlesticks. Required: ${this.lookback} - Current: ${candlesticks.length}`,
      );
    }

    candlesticks = candlesticks.slice(candlesticks.length - this.lookback);

    // Engulfing, Estrella del amanecer, Martillo, Hombre colgado

    return new IndicatorEntity({
      name: this.name,
      children: [
        new IndicatorEntity({
          name: 'ENGULFING_BEARISH',
          value: this.findPattern(candlesticks, 'ENGULFING_BEARISH'),
        }),
        new IndicatorEntity({
          name: 'ENGULFING_BULLISH',
          value: this.findPattern(candlesticks, 'ENGULFING_BULLISH'),
        }),
        new IndicatorEntity({
          name: 'MORNING_STAR',
          value: this.findPattern(candlesticks, 'MORNING_STAR'),
        }),
        new IndicatorEntity({
          name: 'MORNING_STAR_DOJI',
          value: this.findPattern(candlesticks, 'MORNING_STAR_DOJI'),
        }),
        new IndicatorEntity({
          name: 'EVENING_STAR',
          value: this.findPattern(candlesticks, 'EVENING_STAR'),
        }),
        new IndicatorEntity({
          name: 'EVENING_STAR_DOJI',
          value: this.findPattern(candlesticks, 'EVENING_STAR_DOJI'),
        }),
        new IndicatorEntity({
          name: 'HAMMER',
          value: this.findPattern(candlesticks, 'HAMMER'),
        }),
        new IndicatorEntity({
          name: 'INVERTED_HAMMER',
          value: this.findPattern(candlesticks, 'INVERTED_HAMMER'),
        }),
        new IndicatorEntity({
          name: 'HANGING_MAN',
          value: this.findPattern(candlesticks, 'HANGING_MAN'),
        }),
        new IndicatorEntity({
          name: 'PIN_BAR_BEARISH',
          value: this.findPattern(candlesticks, 'PIN_BAR_BEARISH'),
        }),
        new IndicatorEntity({
          name: 'PIN_BAR_BULLISH',
          value: this.findPattern(candlesticks, 'PIN_BAR_BULLISH'),
        }),
        new IndicatorEntity({
          name: 'TWO_BULLISH_CANDLES',
          value: this.findPattern(candlesticks, 'TWO_BULLISH_CANDLES'),
        }),
        new IndicatorEntity({
          name: 'TWO_BEARISH_CANDLES',
          value: this.findPattern(candlesticks, 'TWO_BEARISH_CANDLES'),
        }),
      ],
    });
  };

  findPattern(
    candlesticks: CandlestickEntity[],
    pattern: keyof typeof candlestickPatterns,
  ): boolean {
    try {
      if (!this.findIn) {
        return candlestickPatterns[pattern](candlesticks);
      }

      let patternFound = false;

      for (let i = candlesticks.length; i > 0; i--) {
        try {
          patternFound = candlestickPatterns[pattern](candlesticks.slice(0, i));
        } catch {
          patternFound = false;
        }

        if (patternFound) {
          break;
        }
      }

      return patternFound;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
