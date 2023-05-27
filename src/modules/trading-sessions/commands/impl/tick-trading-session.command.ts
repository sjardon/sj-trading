import { ReferenceContext } from './../../../../common/visitors/reference-contex.visitor';
import { IndicatorExecutorInterface } from 'src/modules/indicators/indicators-set/indicator-executor.interface';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { SignalEntity } from 'src/modules/strategies/signals/entities/signal.entity';
import { OperationEntity } from 'src/modules/operations/entities/operation.entity';
import { StrategyEntity } from 'src/modules/strategies/entities/strategy.entity';
import { TradingSessionEntity } from '../../entities/trading-session.entity';

export class TickTradingSessionCommand {
  constructor(
    public tradingSession: TradingSessionEntity,
    public signals: SignalEntity[],
    public candlesticks: CandlestickEntity[],
    public operation: OperationEntity,
    public strategy: StrategyEntity,
    public referenceContext: ReferenceContext,
    public indicatorExecutors: IndicatorExecutorInterface[],
  ) {}
}
