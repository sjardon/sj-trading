import { TradingSessionEntity } from '../../entities/trading-session.entity';

export class StartTradingSessionEvent {
  constructor(public tradingSessionId: string) {}
}
