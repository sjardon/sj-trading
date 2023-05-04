import { isHight, isLow } from '../../indicators-functions/hight-low.util';
import { CandlestickCollection } from '../../../candlesticks/collections/candlestick.collection';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';

import {
  IndicatorEntity,
  // IndicatorEntityConfiguration,
} from '../../entities/indicator.entity';
import { SMA } from '../../indicators-functions/sma.util';
import { IndicatorExecutorInterface } from '../indicator-executor.interface';

export class SupportResistanceExecutor implements IndicatorExecutorInterface {
  name: string;
  lookback: number;

  constructor(
    name: string,
    inputSupportResistanceIndicatorConfiguration: any, //InputSmaExecutorConfiguration,
  ) {
    const { lookback } = inputSupportResistanceIndicatorConfiguration;

    this.name = name || 'SUPPORT_RESISTANCE';
    this.lookback = lookback || 30;
  }

  exec = (candlesticks: CandlestickEntity[]): IndicatorEntity => {
    if (candlesticks.length < this.lookback) {
      throw new Error(
        `There are not enough candlesticks. Required: ${this.lookback} - Current: ${candlesticks.length}`,
      );
    }

    candlesticks = candlesticks.slice(candlesticks.length - this.lookback);

    const supports: number[] = [];
    const resistances: number[] = [];

    const currentClose = candlesticks[candlesticks.length - 1].close;

    const lows = [];
    const hights = [];

    for (const i in candlesticks) {
      if (isLow(candlesticks, +i, 2, 2)) {
        lows.push(candlesticks[i].low);
        // if (currentClose < candlesticks[i].low) {
        //   supports.push(candlesticks[i].low);
        // } else {
        //   resistances.push(candlesticks[i].low);
        // }
      }

      if (isHight(candlesticks, +i, 2, 2)) {
        hights.push(candlesticks[i].low);
        // if (currentClose > candlesticks[i].high) {
        //   resistances.push(candlesticks[i].high);
        // } else {
        //   supports.push(candlesticks[i].high);
        // }
      }
    }

    return new IndicatorEntity({
      name: this.name,
      children: [
        new IndicatorEntity({
          name: 'SUPPORTS',
          children: this.getAsIndicators(supports),
        }),
        new IndicatorEntity({
          name: 'RESISTANCES',
          children: this.getAsIndicators(resistances),
        }),
      ],
    });
  };

  getAsIndicators(values: number[]) {
    const valuesIndicator = [];
    for (let i = 0; i < values.length; i++) {
      valuesIndicator.push(
        new IndicatorEntity({
          name: i.toString(),
          value: values[i],
        }),
      );
    }

    return valuesIndicator;
  }
}
