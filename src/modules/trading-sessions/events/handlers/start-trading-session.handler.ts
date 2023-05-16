import { CandlesticksService } from '../../../candlesticks/services/candlesticks.service';
import { ReferenceContext } from '../../../../common/visitors/reference-contex.visitor';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StartTradingSessionEvent } from '../impl/start-trading-session.event';
import { Repository } from 'typeorm';
import { TradingSessionEntity } from '../../entities/trading-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ENUM_TRADING_SESSION_STATUS } from '../../constants/trading-session-status.enum.constant';
import { HelperErrorService } from '../../../../common/helpers/services/error/helper.error.service';
import { SignalsFactory } from '../../../strategies/signals/signals.factory';
import { IndicatorsExecutorsFactory } from '../../../indicators/factories/indicators.factory';
import { IndicatorExecutorInterface } from '../../../indicators/indicators-set/indicator-executor.interface';
import { SignalEntity } from '../../../strategies/signals/entities/signal.entity';
import { TickTradingSessionCommand } from '../../commands/impl/tick-trading-session.command';

@EventsHandler(StartTradingSessionEvent)
export class StartTradingSessionHandler
  implements IEventHandler<StartTradingSessionEvent>
{
  protected signals: SignalEntity[];
  protected referenceContextVisitor: ReferenceContext = new ReferenceContext();
  protected indicatorExecturos: IndicatorExecutorInterface[];

  constructor(
    private readonly candlesticksService: CandlesticksService,
    private readonly commandBus: CommandBus,
    private readonly errorHelper: HelperErrorService,
    @InjectRepository(TradingSessionEntity)
    private readonly tradingSessionRepository: Repository<TradingSessionEntity>,
  ) {}

  async handle(event: StartTradingSessionEvent) {
    const { tradingSessionId: id } = event;

    try {
      const tradingSession = await this.tradingSessionRepository.findOne({
        where: { id },
        relations: {
          strategy: true,
        },
      });

      // Validate:
      //  tradingSession should exist
      //  tradingSession status should be created

      if (!tradingSession) {
        throw new BadRequestException(
          `TradingSession with id ${id} does not exist`,
        );
      }

      if (!this.validateTradingSessionStatus(tradingSession)) {
        throw new BadRequestException(
          `TradingSession with ${tradingSession.status} status could not be started`,
        );
      }

      this.initProcess(tradingSession);
      //  Get resources:
      //   - strategy -> indicators,
      //   - candlesticks data,
      //   - risk management,
      //   - account,

      const { symbol, interval } = tradingSession;
      while (true) {
        try {
          const candlesticks = await this.candlesticksService.futuresWatch({
            symbol,
            interval,
            lookback: 1000,
          });

          this.commandBus.execute(new TickTradingSessionCommand(candlesticks));
        } catch (e) {
          console.log(e);
          // throw e // uncomment to stop the loop on exceptions
        }
      }
    } catch (error) {
      throw this.errorHelper.handle(error);
    }
  }

  initProcess(tradingSession: TradingSessionEntity) {
    const { strategy } = tradingSession;

    const signalsFactory = new SignalsFactory();
    this.signals = signalsFactory.create(
      strategy.signals,
      this.referenceContextVisitor,
    );

    const indicatorsExecutorsFactory = new IndicatorsExecutorsFactory();
    this.indicatorExecturos = indicatorsExecutorsFactory.create(
      strategy.indicators,
    );
  }

  validateTradingSessionStatus(tradingSession: TradingSessionEntity) {
    return [ENUM_TRADING_SESSION_STATUS.CREATED].includes(
      tradingSession.status,
    );
  }
}
