import { ReferenceContext } from './../../../../common/visitors/reference-contex.visitor';
import { IndicatorExecutorInterface } from '../../../indicators/indicators-set/indicator-executor.interface';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { SignalEntity } from '../../../strategies/signals/entities/signal.entity';
import { StrategyEntity } from '../../../strategies/entities/strategy.entity';
import { TradingSessionEntity } from '../../entities/trading-session.entity';

export class TickTradingSessionCommand {
  constructor(
    public tradingSession: TradingSessionEntity,
    public signals: SignalEntity[],
    public candlesticks: CandlestickEntity[],
    public strategy: StrategyEntity,
    public referenceContext: ReferenceContext,
    public indicatorExecutors: IndicatorExecutorInterface[],
  ) {}
}
