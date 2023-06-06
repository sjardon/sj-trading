import { TradingSessionEntity } from '../../entities/trading-session.entity';

export class UpdatedTradingSessionEvent {
  constructor(public updatedTradingSession: TradingSessionEntity) {}
}
