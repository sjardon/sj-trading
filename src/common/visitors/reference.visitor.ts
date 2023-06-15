import { BadRequestException } from '@nestjs/common';
import { BacktestOperationEntity } from '../../modules/backtests/backtest-operations/entities/backtest-operation.entity';
import { BacktestOrderEntity } from '../../modules/backtests/backtest-orders/entities/backtest-order.entity';
import { BacktestTimeframeEntity } from '../../modules/backtests/backtest-timeframe/entities/backtest-timeframe.entity';
import { CandlestickEntity } from '../../modules/candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from '../../modules/indicators/entities/indicator.entity';
import { ReferenceOperation } from '../../modules/strategies/signals/operations/reference.operation';
import { OperationEntityAbstract } from '../../modules/operations/entities/operation.entity.abstract';
import { OrderEntityAbstract } from '../../modules/orders/entities/order.entity.abstract';

export type InputReferenceVisitorUpdate = {
  timeframes: BacktestTimeframeEntity[];
  candlesticks: CandlestickEntity[];
  indicators: IndicatorEntity[];
  // TODO: Change for abstract or base order
  operation: OperationEntityAbstract;
  takeProfit: number;
  stopLoss: number;
};

export class ReferenceVisitor {
  timeframes: BacktestTimeframeEntity[];
  candlesticks: CandlestickEntity[];
  indicators: IndicatorEntity[];
  order: OrderEntityAbstract;
  targets: {
    takeProfit: number;
    stopLoss: number;
  };

  constructor(inputReferenceVisitorUpdate: InputReferenceVisitorUpdate) {
    const {
      timeframes,
      candlesticks,
      indicators,
      operation,
      takeProfit,
      stopLoss,
    } = inputReferenceVisitorUpdate;

    this.timeframes = timeframes;
    this.candlesticks = candlesticks;
    this.indicators = indicators;
    this.order = operation?.openOrder;
    this.targets = { takeProfit, stopLoss };
  }

  update(inputReferenceVisitorUpdate: InputReferenceVisitorUpdate) {
    const {
      timeframes,
      candlesticks,
      indicators,
      operation,
      takeProfit,
      stopLoss,
    } = inputReferenceVisitorUpdate;

    this.timeframes = timeframes;
    this.candlesticks = candlesticks;
    this.indicators = indicators;
    this.order = operation?.openOrder;
    this.targets = { takeProfit, stopLoss };
  }

  getByReferenceOperation(referenceOperation: ReferenceOperation) {
    if (!referenceOperation.values.includes('::')) {
      throw new BadRequestException(
        `Imposible to identify reference for ${referenceOperation}`,
      );
    }

    const [propertyKey, ...query] = referenceOperation.values.split('::');

    const value = this.map(propertyKey, query);

    return value;
  }
  map(key: string, query: string[]) {
    const mappedReferences = {
      IND: (query: string[]) => {
        return this.mapIndicator(query);
      },
      CS: (query: string[]) => {
        const [key] = query;
        return this.mapValue(
          this.candlesticks[this.candlesticks.length - 1],
          key,
        );
      },
      ORD: (query: string[]) => {
        const [key] = query;
        return this.mapValue(this.order, key);
      },
      TRG: (query: string[]) => {
        const [key] = query;
        return this.mapValue(this.targets, key);
      },
    };

    if (!mappedReferences[key]) {
      throw new BadRequestException(`${key} is not a valid reference`);
    }

    return mappedReferences[key](query);
  }

  mapValue(property: any, key: string) {
    if (!property) {
      return false;
    }

    if (!property[key]) {
      throw new BadRequestException(`${key} is not a valid reference`);
    }

    return property[key];
  }

  mapIndicator(query) {
    const [indicatorName] = query;
    const [mappedIndicatorValue] = this.indicators
      .map((indicator) => {
        try {
          return indicator.getValueByName(indicatorName);
        } catch (error) {
          return undefined;
        }
      })
      .filter((indicatorValue) => indicatorValue !== undefined);

    if (mappedIndicatorValue === undefined) {
      throw new BadRequestException(
        `${indicatorName} is not a valid indicator name`,
      );
    }

    return mappedIndicatorValue;
  }
}
