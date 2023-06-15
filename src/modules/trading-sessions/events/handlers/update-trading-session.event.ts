import { TradingSessionsStatusService } from './../../services/trading-sessions-status.service';
import { ReferenceContext } from '../../../../common/visitors/reference-contex.visitor';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IndicatorExecutorInterface } from '../../../indicators/indicators-set/indicator-executor.interface';
import { SignalEntity } from '../../../strategies/signals/entities/signal.entity';
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
