import { Controller, Get, Param, Render } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { BacktestCandlestickService } from 'src/backtests/services/backtest-candlestick.service';
import { BacktestOperationsService } from 'src/backtests/backtest-operations/backtest-operations.service';
import { BacktestTimeframesService } from 'src/backtests/backtest-timeframe/backtest-timeframes.service';
import { IndicatorEntity } from 'src/indicators/entities/indicator.entity';
import { BacktestOperationEntity } from 'src/backtests/backtest-operations/entities/backtest-operation.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly backtestCandlestickService: BacktestCandlestickService,
    private readonly backtestOperationsService: BacktestOperationsService,
    private readonly backtestTimeframesService: BacktestTimeframesService,
  ) {}

  @Get('backtest/:backtestId')
  @Render('index')
  async root(@Param() params: any) {
    const { backtestId } = params;

    let backtestOperations =
      await this.backtestOperationsService.getAllByBacktest(backtestId);

    backtestOperations = backtestOperations.filter(
      (operation) => operation['openOrder'] && operation['closeOrder'],
    );

    const timeframes = await this.backtestTimeframesService.getAllByBacktest(
      backtestId,
    );

    const indicators: IndicatorEntity[] = timeframes
      .map((timeframe) => timeframe.indicators)
      .flat();

    const curSr = indicators
      .filter((indicator) => indicator.name == 'CUR_SR')
      .map((indicator) => indicator.children)
      .flat();

    const time = timeframes.map((timeframe) =>
      new Date(+timeframe.candlestick.closeTime * 1000).toISOString(),
    );

    return {
      statistics: {
        totalRate: this.getTotalRate(backtestOperations),
        profiteableCount: this.getProfiteableCount(backtestOperations),
        unprofiteableCount: this.getUnprofiteableCount(backtestOperations),
        profiteableAvg: this.getProfiteableAvg(backtestOperations),
        unprofiteableAvg: this.getUnprofiteableAvg(backtestOperations),
      },
      dataToPlot: {
        candlesticks: {
          time,
          open: timeframes.map((timeframe) => timeframe.candlestick.open),
          close: timeframes.map((timeframe) => timeframe.candlestick.close),
          high: timeframes.map((timeframe) => timeframe.candlestick.high),
          low: timeframes.map((timeframe) => timeframe.candlestick.low),
          volume: timeframes.map((timeframe) => timeframe.candlestick.volume),
        },
        openOrders: {
          time: backtestOperations.map((op) =>
            new Date(+op.openOrder.transactTime).toISOString(),
          ),
          values: backtestOperations.map((op) => op.openOrder.executedQty),
        },
        closeOrders: {
          time: backtestOperations.map((op) =>
            new Date(+op.closeOrder.transactTime).toISOString(),
          ),
          values: backtestOperations.map((op) => op.closeOrder.executedQty),
        },
        SMA_20: {
          time,
          values: indicators
            .filter((indicator) => indicator.name == 'SMA_20')
            .map((indicator) => indicator.value),
        },
        SMA_200: {
          time,
          values: indicators
            .filter((indicator) => indicator.name == 'SMA_200')
            .map((indicator) => indicator.value),
        },
        SMA_VOL_5: {
          time,
          values: indicators
            .filter((indicator) => indicator.name == 'SMA_VOL_5')
            .map((indicator) => indicator.value),
        },
        PREV_LEVEL_1: {
          time,
          values: curSr
            .filter((indicator) => indicator.name == 'PREV_LEVEL_1')
            .map((indicator) => indicator.value),
        },
        PREV_LEVEL_2: {
          time,
          values: curSr
            .filter((indicator) => indicator.name == 'PREV_LEVEL_2')
            .map((indicator) => indicator.value),
        },
        NEXT_LEVEL_1: {
          time,
          values: curSr
            .filter((indicator) => indicator.name == 'NEXT_LEVEL_1')
            .map((indicator) => indicator.value),
        },
        NEXT_LEVEL_2: {
          time,
          values: curSr
            .filter((indicator) => indicator.name == 'NEXT_LEVEL_2')
            .map((indicator) => indicator.value),
        },
        CURRENT_LEVEL: {
          time,
          values: curSr
            .filter((indicator) => indicator.name == 'CURRENT_LEVEL')
            .map((indicator) => indicator.value),
        },
      },
    };
  }

  getTotalRate(backtestOperations: BacktestOperationEntity[]): number {
    return backtestOperations.reduce((accumulator, currentOperation) => {
      return (
        accumulator *
        (currentOperation.closeOrder.executedQty /
          currentOperation.openOrder.executedQty)
      );
    }, 1);
  }

  getProfiteableCount(backtestOperations: BacktestOperationEntity[]): number {
    return backtestOperations.filter(
      (operation) =>
        operation.closeOrder.executedQty > operation.openOrder.executedQty,
    ).length;
  }

  getUnprofiteableCount(backtestOperations: BacktestOperationEntity[]): number {
    return backtestOperations.filter(
      (operation) =>
        operation.closeOrder.executedQty < operation.openOrder.executedQty,
    ).length;
  }

  getProfiteableAvg(backtestOperations: BacktestOperationEntity[]): number {
    const profiteableOperations = backtestOperations.filter(
      (operation) =>
        operation.closeOrder.executedQty > operation.openOrder.executedQty,
    );

    return (
      profiteableOperations.reduce((accumulator, currentOperation) => {
        return (
          accumulator +
          currentOperation.closeOrder.executedQty /
            currentOperation.openOrder.executedQty
        );
      }, 0) / profiteableOperations.length
    );
  }

  getUnprofiteableAvg(backtestOperations: BacktestOperationEntity[]): number {
    const unprofiteableOperations = backtestOperations.filter(
      (operation) =>
        operation.closeOrder.executedQty < operation.openOrder.executedQty,
    );
    return (
      unprofiteableOperations.reduce((accumulator, currentOperation) => {
        return (
          accumulator +
          currentOperation.closeOrder.executedQty /
            currentOperation.openOrder.executedQty
        );
      }, 0) / unprofiteableOperations.length
    );
  }
}
