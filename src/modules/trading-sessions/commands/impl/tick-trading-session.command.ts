import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';

export class TickTradingSessionCommand {
  constructor(public candlesticks: CandlestickEntity[]) {}
}
