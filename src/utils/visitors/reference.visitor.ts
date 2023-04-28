import { BadRequest } from 'ccxt';
import { BacktestOperationEntity } from 'src/backtests/backtest-operations/entities/backtest-operation.entity';
import { BacktestOrderEntity } from 'src/backtests/backtest-orders/entities/backtest-order.entity';
import { CandlestickEntity } from 'src/candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from '../../indicators/entities/indicator.entity';
import { PrimitiveOperation } from 'src/strategies/signals/operations/primitive.operation';
import { ReferenceOperation } from 'src/strategies/signals/operations/reference.operation';
import { BacktestTimeframeEntity } from 'src/backtests/backtest-timeframe/entities/backtest-timeframe.entity';

export type InputReferenceVisitorUpdate = {
  timeframes: BacktestTimeframeEntity[];
  candlesticks: CandlestickEntity[];
  indicators: IndicatorEntity[];
  // TODO: Change for abstract or base order
  operation: BacktestOperationEntity;
  takeProfit: number;
  stopLoss: number;
};

export class ReferenceVisitor {
  timeframes: BacktestTimeframeEntity[];
  candlesticks: CandlestickEntity[];
  indicators: IndicatorEntity[];
  order: BacktestOrderEntity;
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
      throw new BadRequest(
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
      throw new BadRequest(`${key} is not a valid reference`);
    }

    return mappedReferences[key](query);
  }

  mapValue(property: any, key: string) {
    if (!property) {
      return false;
    }

    if (!property[key]) {
      throw new BadRequest(`${key} is not a valid reference`);
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
          return false;
        }
      })
      .filter((indicatorValue) => indicatorValue);

    if (!mappedIndicatorValue) {
      throw new BadRequest(`${indicatorName} is not a valid indicator name`);
    }

    return mappedIndicatorValue;
  }
}
