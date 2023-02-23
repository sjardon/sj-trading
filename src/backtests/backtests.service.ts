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
import {
  SignalAction,
  SignalEntity,
} from 'src/strategies/signals/entities/signal.entity';
import { IndicatorsExecutorsFactory } from '../indicators/indicators.factory';
import { BacktestOperationEntity } from './backtest-operations/entities/backtest-operation.entity';
import { BacktestOperationsService } from './backtest-operations/backtest-operations.service';
import { CandlestickEntity } from 'src/candlesticks/entities/candlestick.entity';
import { IndicatorExecutorInterface } from 'src/indicators/indicators-set/indicator-executor.interface';
import { IndicatorEntity } from 'src/indicators/entities/indicator.entity';

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
  protected referenceVisitor: ReferenceVisitor = new ReferenceVisitor();
  protected indicatorExecturos: IndicatorExecutorInterface[];
  protected signals: SignalEntity[];
  protected backtest: BacktestEntity;

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
      await this.initProcess(createBacktestDto);
      await this.startProcess();
      return await this.finishProcess();
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
      this.referenceVisitor,
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
      const currentCandlesticks = this.candlesticksSamples.slice(
        i - candlesticksRange,
        i,
      );

      const indicators = this.indicatorExecturos.map((indicatorExecutor) =>
        indicatorExecutor.exec(currentCandlesticks),
      );

      this.candlesticksSamples[i].indicators = indicators;

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
      this.referenceVisitor.update({
        candlesticks: currentCandlesticks,
        indicators,
        operation: this.operation,
        takeProfit: this.backtest.strategy.takeProfit,
        stopLoss: this.backtest.strategy.stopLoss,
      });

      const actionToPerform: SignalAction = this.analyzersService.analyze(
        this.signals,
        this.operation,
      );

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
      this.logger.log(`Error startProcessCurrentCandlesticks`);
    }
  }

  async finishProcess() {
    const savedCandlesticks = await this.saveCandlestickSample();

    this.logger.log(
      `Backtest ${this.backtest.name} - ${this.backtest.id} ended`,
    );

    return this.backtest;
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

  protected async saveCandlestickSample() {
    this.candlesticksSamples = await this.candlesticksService.create(
      this.candlesticksSamples,
    );

    return this.candlesticksSamples;
  }
}
