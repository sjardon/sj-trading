import { ATR } from 'src/indicators/indicators-functions/atr.util';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';

import { IndicatorEntity } from '../../entities/indicator.entity';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';

// export type InputSmaExecutorConfiguration = IndicatorEntityConfiguration & {
//   candlesticks: CandlestickEntity[];
//   lookback?: number;
// };

export class AtrExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;
  target: keyof CandlestickEntity;

  constructor(
    name: string,
    inputAtrIndicatorConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    const { lookback } = inputAtrIndicatorConfiguration;

    this.name = name || 'ATR';
    this.lookback = lookback || 14;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    const value = ATR(candlesticks, this.lookback);

    return new IndicatorEntity({
      name: this.name,
      value,
    });
  };
}
