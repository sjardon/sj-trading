import { TradingSessionsStatusService } from './../../services/trading-sessions-status.service';
import { CandlesticksService } from '../../../candlesticks/services/candlesticks.service';
import { ReferenceContext } from '../../../../common/visitors/reference-contex.visitor';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StartTradingSessionEvent } from '../impl/start-trading-session.event';
import { Repository } from 'typeorm';
import { TradingSessionEntity } from '../../entities/trading-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { ENUM_TRADING_SESSION_STATUS } from '../../constants/trading-session-status.enum.constant';
import { HelperErrorService } from '../../../../common/helpers/services/error/helper.error.service';
import { SignalsFactory } from '../../../strategies/signals/signals.factory';
import { IndicatorsExecutorsFactory } from '../../../indicators/factories/indicators.factory';
import { IndicatorExecutorInterface } from '../../../indicators/indicators-set/indicator-executor.interface';
import { SignalEntity } from '../../../strategies/signals/entities/signal.entity';
import { TickTradingSessionCommand } from '../../commands/impl/tick-trading-session.command';
import { CreateIndicatorExecutorDto } from 'src/modules/indicators/dto/create-indicator-executor.dto';
import { StrategyEntity } from 'src/modules/strategies/entities/strategy.entity';
import { UpdatedTradingSessionEvent } from '../impl/update-trading-session.event';

@EventsHandler(UpdatedTradingSessionEvent)
export class UpdatedTradingSessionHandler
  implements IEventHandler<UpdatedTradingSessionEvent>
{
  protected signals: SignalEntity[];
  protected referenceContextVisitor: ReferenceContext = new ReferenceContext();
  protected indicatorExecutors: IndicatorExecutorInterface[];

  constructor(
    private readonly tradingSessionsStatusService: TradingSessionsStatusService,
  ) {}

  async handle(event: UpdatedTradingSessionEvent) {
    const { updatedTradingSession: tradingSession } = event;
    this.tradingSessionsStatusService.update(tradingSession.id, tradingSession);
  }
}
