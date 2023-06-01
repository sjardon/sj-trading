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
import { ReferenceVisitor } from 'src/common/visitors/reference.visitor';
import { OperationEntity } from 'src/modules/operations/entities/operation.entity';
import { CreateIndicatorExecutorDto } from 'src/modules/indicators/dto/create-indicator-executor.dto';
import { StrategyEntity } from 'src/modules/strategies/entities/strategy.entity';
import { BalancesService } from 'src/modules/balances/services/balances.service';

@EventsHandler(StartTradingSessionEvent)
export class StartTradingSessionHandler
  implements IEventHandler<StartTradingSessionEvent>
{
  protected signals: SignalEntity[];
  protected referenceContextVisitor: ReferenceContext = new ReferenceContext();
  protected indicatorExecutors: IndicatorExecutorInterface[];
  protected operation: OperationEntity;

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

      const { symbol, interval, strategy } = tradingSession;

      const signals = this.getSignals(strategy);

      const indicatorExecutors = this.getIndicatorExecutors(
        strategy.indicators,
      );

      // TODO: Set leverage -> global

      //  Get resources:
      //   - timeframes: candlesticks and indicators,
      //   - risk management,
      //   - account,

      // TODO: add some var for loop controll

      while (true) {
        try {
          const candlesticks = await this.candlesticksService.futuresWatch({
            symbol,
            interval,
            lookback: 1000,
          });

          this.commandBus.execute(
            new TickTradingSessionCommand(
              tradingSession,
              signals,
              candlesticks,
              this.operation,
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
