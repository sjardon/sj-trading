import { Controller, Get, Param, Render } from '@nestjs/common';
import { StatisticsService } from '../services/statistics.service';
import { BacktestOperationsService } from '../../backtests/backtest-operations/backtest-operations.service';
import { BacktestTimeframesService } from '../../backtests/backtest-timeframe/backtest-timeframes.service';
import { IndicatorEntity } from '../../indicators/entities/indicator.entity';
import { BacktestEntity } from '../../backtests/entities/backtest.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly backtestOperationsService: BacktestOperationsService,
    private readonly backtestTimeframesService: BacktestTimeframesService,
  ) {}

  @Get('backtest/:backtestId')
  @Render('index')
  async root(@Param() params: any) {
    const { backtestId } = params;

    let statistics = await this.statisticsService.getByBacktest({ backtestId });

    let backtestOperations =
      await this.backtestOperationsService.getAllByBacktest(backtestId);

    if (!statistics && backtestOperations.length > 0) {
      const generatedStatistics =
        await this.statisticsService.generateFromOperations(
          { id: backtestId } as BacktestEntity,
          backtestOperations,
        );

      statistics = generatedStatistics[0];
    }

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

    const longOperations = backtestOperations.filter((op) => op.isLong());
    const shortOperations = backtestOperations.filter((op) => op.isShort());
    const operations = backtestOperations.filter((op) => op.isBoth());

    return {
      statistics,
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
          time: operations.map((op) =>
            new Date(+op.openOrder.transactTime).toISOString(),
          ),
          values: operations.map((op) => op.openOrder.executedQty),
        },
        closeOrders: {
          time: operations.map((op) =>
            new Date(+op.closeOrder.transactTime).toISOString(),
          ),
          values: operations.map((op) => op.closeOrder.executedQty),
        },
        openLongOrders: {
          time: longOperations.map((op) =>
            new Date(+op.openOrder.transactTime).toISOString(),
          ),
          values: longOperations.map((op) => op.openOrder.executedQty),
        },
        closeLongOrders: {
          time: longOperations.map((op) =>
            new Date(+op.closeOrder.transactTime).toISOString(),
          ),
          values: longOperations.map((op) => op.closeOrder.executedQty),
        },
        openShortOrders: {
          time: shortOperations.map((op) =>
            new Date(+op.openOrder.transactTime).toISOString(),
          ),
          values: shortOperations.map((op) => op.openOrder.executedQty),
        },
        closeShortOrders: {
          time: shortOperations.map((op) =>
            new Date(+op.closeOrder.transactTime).toISOString(),
          ),
          values: shortOperations.map((op) => op.closeOrder.executedQty),
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
}
