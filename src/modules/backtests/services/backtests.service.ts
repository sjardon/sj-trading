import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReferenceVisitor } from '../../../common/visitors/reference.visitor';
import { ReferenceContext } from '../../../common/visitors/reference-contex.visitor';

import { BacktestOperationEntity } from '../backtest-operations/entities/backtest-operation.entity';
import { BacktestOperationsService } from '../backtest-operations/backtest-operations.service';
import { CreateBacktestDto } from '../dto/create-backtest.dto';
import { BacktestEntity } from '../entities/backtest.entity';
import { BacktestTimeframesService } from '../backtest-timeframe/backtest-timeframes.service';

import { CandlestickIntervalType } from '../../candlesticks/intervals/candlestick-interval.type';
import { CandlesticksService } from '../../candlesticks/services/candlesticks.service';
import { CandlestickSymbolType } from '../../candlesticks/symbols/candlestick-symbol.type';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';

import { AnalyzersService } from '../../analyzers/analyzers.service';
import { StrategiesService } from '../../strategies/services/strategies.service';
import { SignalsFactory } from '../../strategies/signals/signals.factory';
import {
  SignalAction,
  SignalEntity,
} from '../../strategies/signals/entities/signal.entity';
import { IndicatorsExecutorsFactory } from '../../indicators/factories/indicators.factory';
import { IndicatorExecutorInterface } from '../../indicators/indicators-set/indicator-executor.interface';
import { IndicatorEntity } from '../../indicators/entities/indicator.entity';
import { StatisticsService } from '../../statistics/services/statistics.service';

export type InputGetCandlestickSample = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
  startTime: number;
  endTime: number;
};

@Injectable()
export class BacktestsService {
  private readonly logger = new Logger(BacktestsService.name);
  protected operation: BacktestOperationEntity | undefined;
  protected candlesticksSamples: CandlestickEntity[];
  protected referenceContextVisitor: ReferenceContext = new ReferenceContext();
  protected indicatorExecturos: IndicatorExecutorInterface[];
  protected signals: SignalEntity[];
  protected backtest: BacktestEntity;

  constructor(
    private candlesticksService: CandlesticksService,
    private timeframeService: BacktestTimeframesService,
    private strategiesService: StrategiesService,
    private analyzersService: AnalyzersService,
    private backtestOperationsService: BacktestOperationsService,
    private statisticsService: StatisticsService,
    @InjectRepository(BacktestEntity)
    private backtestsRepository: Repository<BacktestEntity>,
  ) {}

  public async create(
    createBacktestDto: CreateBacktestDto,
  ): Promise<BacktestEntity> {
    try {
      await this.initProcess(createBacktestDto);
      await this.startProcess();
      await this.finishProcess();
      return this.backtest;
    } catch (thrownError) {
      this.finishFailedProcess(thrownError);
      throw thrownError;
    }
  }

  async initProcess(createBacktestDto: CreateBacktestDto) {
    const { name, strategyId, symbol, interval, startTime, endTime } =
      createBacktestDto;

    const strategy = await this.getStrategy(strategyId);

    const backtest = this.backtestsRepository.create({
      name,
      strategy,
      symbol,
      interval,
      startTime: startTime,
      endTime: endTime,
    });

    this.backtest = await this.backtestsRepository.save(backtest);

    this.logger.log(
      `Backtest ${this.backtest.name} - ${this.backtest.id} started`,
    );

    // TODO: Remplace referenceVisitor for a service with rxjs

    const signalsFactory = new SignalsFactory();
    this.signals = signalsFactory.create(
      strategy.signals,
      this.referenceContextVisitor,
    );

    const indicatorsExecutorsFactory = new IndicatorsExecutorsFactory();
    this.indicatorExecturos = indicatorsExecutorsFactory.create(
      strategy.indicators,
    );

    this.candlesticksSamples = await this.getCandlestickSample({
      symbol,
      interval,
      startTime: startTime.getTime(),
      endTime: endTime.getTime(),
    });

    this.logger.log(`Signals, indicators and candlestics loaded`);

    // TODO: Get candlesticks lookback from indicators
  }

  async startProcess() {
    const candlesticksRange = 250;

    for (
      let i = candlesticksRange;
      i <= this.candlesticksSamples.length - 1;
      i++
    ) {
      //Get current candlesticks

      const currentCandlesticks = this.candlesticksSamples.slice(
        i - candlesticksRange,
        i,
      );

      // Load indicators

      const indicators = this.indicatorExecturos.map((indicatorExecutor) =>
        indicatorExecutor.exec(currentCandlesticks),
      );

      // TODO: Save timeframes in an event.

      this.timeframeService.create({
        backtest: this.backtest,
        candlestick: this.candlesticksSamples[i],
        indicators,
      });

      await this.startProcessCurrentCandlesticks(
        currentCandlesticks,
        indicators,
      );
    }
  }

  async startProcessCurrentCandlesticks(
    currentCandlesticks: CandlestickEntity[],
    indicators: IndicatorEntity[],
  ) {
    try {
      // Load current scope data

      this.referenceContextVisitor.addReference(
        new ReferenceVisitor({
          timeframes: [],
          candlesticks: currentCandlesticks,
          indicators,
          operation: this.operation,
          // Set strategy constants
          takeProfit: this.backtest.strategy.takeProfit,
          stopLoss: this.backtest.strategy.stopLoss,
        }),
      );

      // Analyze current data

      const actionToPerform: SignalAction = this.analyzersService.analyze(
        this.signals,
        this.operation,
      );

      // Perform action

      if (actionToPerform == SignalAction.NOTHING) {
        return;
      }

      this.logger.log(`Running operation as ${actionToPerform}`);

      // TODO: Parameters refactor
      this.operation =
        await this.backtestOperationsService.createBySignalAction(
          this.operation,
          {
            actionToPerform,
            symbol: this.backtest.symbol,
            quantity: '0',
            backtest: this.backtest,
          },
          currentCandlesticks[currentCandlesticks.length - 1],
        );

      this.logger.log(`Operation done: ${this.operation.id}`);
    } catch (error) {
      // console.log(error);
      this.logger.log(`Error startProcessCurrentCandlesticks`);
    }
  }

  async finishProcess() {
    const backtestOperations =
      await this.backtestOperationsService.getAllByBacktest(this.backtest.id);

    await this.statisticsService.generateFromOperations(
      this.backtest,
      backtestOperations,
    );

    this.logger.log(
      `Backtest ${this.backtest.name} - ${this.backtest.id} ended`,
    );
  }

  finishFailedProcess(thrownError: any) {
    this.logger.log(`Error: ${thrownError.message}`);
  }

  protected async getStrategy(strategyId: string) {
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
