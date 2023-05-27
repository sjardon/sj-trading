import { IndicatorExecutorInterface } from 'src/modules/indicators/indicators-set/indicator-executor.interface';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { SignalEntity } from 'src/modules/strategies/signals/entities/signal.entity';

export class TickTradingSessionCommand {
  constructor(
    public signals: SignalEntity[],
    public candlesticks: CandlestickEntity[],
    public indicatorsExecutors: IndicatorExecutorInterface[],
  ) {}
}
