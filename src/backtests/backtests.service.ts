import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CandlestickIntervalType } from '../candlesticks/intervals/candlestick-interval.type';
import { CandlesticksService } from '../candlesticks/candlesticks.service';
import { CandlestickSymbolType } from '../candlesticks/symbols/candlestick-symbol.type';
import { CreateBacktestDto } from './dto/create-backtest.dto';
import { BacktestEntity } from './entities/backtest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StrategiesService } from 'src/strategies/strategies.service';
import { SignalsFactory } from 'src/strategies/signals/signals.factory';
import { ReferenceVisitor } from 'src/utils/visitors/reference.visitor';
import { AnalyzersService } from 'src/analyzers/analyzers.service';
import { BacktestOrderEntity } from './backtest-orders/entities/backtest-order.entity';
import { SignalAction } from 'src/strategies/signals/entities/signal.entity';
import { BacktestOrdersService } from './backtest-orders/backtest-orders.service';
import { IndicatorsExecutorsFactory } from 'src/strategies/indicators/indicators.factory';
import { BacktestOperationEntity } from './backtest-operations/entities/backtest-operation.entity';
import { BacktestOperationsService } from './backtest-operations/backtest-operations.service';

export type InputGetCandlestickSample = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
  startTime: number;
  endTime: number;
};

@Injectable()
export class BacktestsService {
  private readonly logger = new Logger(BacktestsService.name);

  constructor(
    private candlesticksService: CandlesticksService,
    private strategiesService: StrategiesService,
    private analyzersService: AnalyzersService,
    private backtestOperationsService: BacktestOperationsService,
    @InjectRepository(BacktestEntity)
    private backtestsRepository: Repository<BacktestEntity>,
  ) {}

  public async create(
    createBacktestDto: CreateBacktestDto,
  ): Promise<BacktestEntity> {
    try {
      const { name, strategyId, symbol, interval, startTime, endTime } =
        createBacktestDto;

      const strategy = await this.getStrategy(strategyId);

      let backtest = this.backtestsRepository.create({
        name,
        strategy,
        symbol,
        interval,
        startTime: startTime,
        endTime: endTime,
      });

      backtest = await this.backtestsRepository.save(backtest);

      this.logger.log(`Backtest ${backtest.name} - ${backtest.id} started`);

      // TODO: Remplace referenceVisitor for a service with rxjs
      const referenceVisitor = new ReferenceVisitor();

      const signalsFactory = new SignalsFactory();
      const signals = signalsFactory.create(strategy.signals, referenceVisitor);

      const indicatorsExecutorsFactory = new IndicatorsExecutorsFactory();
      const indicatorExecturos = indicatorsExecutorsFactory.create(
        strategy.indicators,
      );

      // TODO: automaticaly generate a backtest for different intervals and symbols, depending of the requested params.
      // TODO: Save candlesticks on DB
      //  -> Add indicators to candlesticks
      //  -> Create candlesticks - backtest relationship

      const candlesticksSamples = await this.getCandlestickSample({
        symbol,
        interval,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
      });

      this.logger.log(`Signals, indicators and candlestics loaded`);

      // TODO: Get candlesticks lookback from indicators
      const candlesticksRange = 250;
      let operation: BacktestOperationEntity | undefined;

      for (
        let i = candlesticksRange;
        i <= candlesticksSamples.length - 1;
        i++
      ) {
        const currentCandlesticks = candlesticksSamples.slice(
          i - candlesticksRange,
          i,
        );

        referenceVisitor.update({
          candlesticks: currentCandlesticks,
          indicators: indicatorExecturos.map((indicatorExecutor) =>
            indicatorExecutor.exec(currentCandlesticks),
          ),
          operation,
          takeProfit: strategy.takeProfit,
          stopLoss: strategy.stopLoss,
        });

        const actionToPerform: SignalAction = this.analyzersService.analyze(
          signals,
          operation,
        );

        if (actionToPerform == SignalAction.NOTHING) {
          continue;
        }

        this.logger.log(`Running operation as ${actionToPerform}`);

        // TODO: Parameters refactor
        operation = await this.backtestOperationsService.createBySignalAction(
          operation,
          {
            actionToPerform,
            symbol,
            quantity: '0',
            backtest,
          },
          currentCandlesticks[currentCandlesticks.length - 1],
        );

        this.logger.log(`Operation done: ${operation.id}`);
      }

      this.logger.log(`Backtest ${backtest.name} - ${backtest.id} ended`);

      return backtest;
    } catch (thrownError) {
      this.logger.log(`Error: ${thrownError.message}`);
      throw thrownError;
    }
  }

  private async getStrategy(strategyId: string) {
    const strategy = await this.strategiesService.findOne(strategyId);

    if (!strategy) {
      throw new BadRequestException(`strategyId ${strategyId} does not exist`);
    }

    return strategy;
  }

  protected async getCandlestickSample({
    symbol,
    interval,
    startTime,
    endTime,
  }: InputGetCandlestickSample) {
    return await this.candlesticksService.futuresGet({
      symbol,
      interval,
      startTime,
      endTime,
      lookback: 1000,
    });
  }
}
