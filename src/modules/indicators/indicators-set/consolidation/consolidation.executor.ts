import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';
import { IndicatorEntity } from '../../entities/indicator.entity';

export class ConsolidationExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;
  threshold: number;

  constructor(
    name: string,
    inputConsolidationIndicatorConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    const { lookback, threshold } = inputConsolidationIndicatorConfiguration;

    this.name = name || 'CONSOLIDATION';
    this.lookback = lookback || 30;
    this.threshold = threshold;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    try {
      if (candlesticks.length < this.lookback) {
        throw new Error(
          `There are not enough candlesticks. Required: ${this.lookback} - Current: ${candlesticks.length}`,
        );
      }

      candlesticks = candlesticks.slice(candlesticks.length - this.lookback);

      const lows = candlesticks.map((candlestick) => candlestick.low);
      const highs = candlesticks.map((candlestick) => candlestick.high);
      const isConsolidation =
        Math.max(...highs) / Math.min(...lows) < this.threshold;

      return new IndicatorEntity({
        name: this.name,
        value: isConsolidation ? 1 : -1,
      });
    } catch (error) {
      // console.log('error:', error);
      throw error;
    }
  };
}
