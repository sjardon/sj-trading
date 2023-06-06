import { CandlesticksService } from '../../../candlesticks/services/candlesticks.service';
import { ReferenceContext } from '../../../../common/visitors/reference-contex.visitor';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StartTradingSessionEvent } from '../impl/start-trading-session.event';
import { Repository } from 'typeorm';
import { TradingSessionEntity } from '../../entities/trading-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { ENUM_TRADING_SESSION_STATUS } from '../../constants/trading-session-status.enum.constant';
import { HelperErrorService } from '../../../../common/helpers/services/error/helper.error.service';
import { SignalsFactory } from '../../../strategies/signals/signals.factory';
import { IndicatorsExecutorsFactory } from '../../../indicators/factories/indicators.factory';
import { IndicatorExecutorInterface } from '../../../indicators/indicators-set/indicator-executor.interface';
import { SignalEntity } from '../../../strategies/signals/entities/signal.entity';
import { TickTradingSessionCommand } from '../../commands/impl/tick-trading-session.command';
import { CreateIndicatorExecutorDto } from 'src/modules/indicators/dto/create-indicator-executor.dto';
import { StrategyEntity } from 'src/modules/strategies/entities/strategy.entity';
import { TradingSessionsStatusService } from '../../services/trading-sessions-status.service';

@EventsHandler(StartTradingSessionEvent)
export class StartTradingSessionHandler
  implements IEventHandler<StartTradingSessionEvent>
{
  private readonly logger = new Logger(StartTradingSessionHandler.name);
  protected signals: SignalEntity[];
  protected referenceContextVisitor: ReferenceContext = new ReferenceContext();
  protected indicatorExecutors: IndicatorExecutorInterface[];
  protected tradingSession: TradingSessionEntity;

  constructor(
    private readonly candlesticksService: CandlesticksService,
    private readonly commandBus: CommandBus,
    private readonly errorHelper: HelperErrorService,
    private readonly tradingSessionsStatusService: TradingSessionsStatusService,
    @InjectRepository(TradingSessionEntity)
    private readonly tradingSessionRepository: Repository<TradingSessionEntity>,
  ) {}

  getUpdatedTradingSession(id) {
    this.tradingSessionsStatusService
      .get(id)
      .subscribe((next: TradingSessionEntity) => (this.tradingSession = next));
  }

  async handle(event: StartTradingSessionEvent) {
    const { tradingSessionId: id } = event;
    try {
      this.tradingSession = await this.tradingSessionRepository.findOne({
        where: { id },
        relations: {
          strategy: true,
        },
      });

      // Validate:
      //  tradingSession should exist
      //  tradingSession status should be created

      if (!this.tradingSession) {
        throw new BadRequestException(
          `TradingSession with id ${id} does not exist`,
        );
      }

      if (!this.validateTradingSessionStatus(this.tradingSession)) {
        throw new BadRequestException(
          `TradingSession with ${this.tradingSession.status} status could not be started`,
        );
      }

      this.tradingSession.status = ENUM_TRADING_SESSION_STATUS.IN_PROGRESS;
      await this.tradingSessionRepository.save(this.tradingSession);

      this.tradingSessionsStatusService.add(id, this.tradingSession);
      this.getUpdatedTradingSession(id);

      const { symbol, interval, strategy } = this.tradingSession;

      const signals = this.getSignals(strategy);

      const indicatorExecutors = this.getIndicatorExecutors(
        strategy.indicators,
      );

      // TODO: Set leverage -> global
      // TODO: add some var for loop controll
      this.logger.log(`Starting tradingSession [${this.tradingSession.id}]`);

      while (
        this.tradingSession.status == ENUM_TRADING_SESSION_STATUS.IN_PROGRESS
      ) {
        try {
          const candlesticks = await this.candlesticksService.futuresWatch({
            symbol,
            interval,
            lookback: 1000,
          });

          await this.commandBus.execute(
            new TickTradingSessionCommand(
              this.tradingSession,
              signals,
              candlesticks,
              strategy,
              this.referenceContextVisitor,
              indicatorExecutors,
            ),
          );
        } catch (e) {
          console.log(e);
          // throw e // uncomment to stop the loop on exceptions
        }
      }
      this.logger.log(`Ending tradingSession [${this.tradingSession.id}]`);
    } catch (error) {
      throw this.errorHelper.handle(error);
    }
  }

  private getSignals(strategy: StrategyEntity) {
    const signalsFactory = new SignalsFactory();
    return signalsFactory.create(
      strategy.signals,
      this.referenceContextVisitor,
    );
  }

  private getIndicatorExecutors(indicators: CreateIndicatorExecutorDto[]) {
    const indicatorsExecutorsFactory = new IndicatorsExecutorsFactory();
    return indicatorsExecutorsFactory.create(indicators);
  }

  private validateTradingSessionStatus(tradingSession: TradingSessionEntity) {
    return [ENUM_TRADING_SESSION_STATUS.CREATED].includes(
      tradingSession.status,
    );
  }
}
