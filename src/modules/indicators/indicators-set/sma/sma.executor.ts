import { CandlestickCollection } from '../../../candlesticks/collections/candlestick.collection';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';

import {
  IndicatorEntity,
  // IndicatorEntityConfiguration,
} from '../../entities/indicator.entity';
import { SMA } from '../../indicators-functions/sma.util';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';

// export type InputSmaExecutorConfiguration = IndicatorEntityConfiguration & {
//   candlesticks: CandlestickEntity[];
//   lookback?: number;
// };

export class SmaExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;
  target: keyof CandlestickEntity;

  constructor(
    name: string,
    inputEmaIndicatorConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    const { lookback, target } = inputEmaIndicatorConfiguration;

    this.name = name || 'SMA';
    this.lookback = lookback || 5;
    this.target = target || 'close';
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    const values = CandlestickCollection.getValuesOf(
      this.target,
      candlesticks,
    ) as number[];

    const value = SMA(values, this.lookback);

    // return new IndicatorEntity({
    //   name: this.name,
    //   value,
    // });
    return new IndicatorEntity({
      name: this.name,
      value,
    });
  };
}
