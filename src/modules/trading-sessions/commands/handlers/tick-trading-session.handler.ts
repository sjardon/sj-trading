import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TickTradingSessionCommand } from '../impl/tick-trading-session.command';
import { Logger } from '@nestjs/common';
import { SignalAction } from 'src/modules/strategies/signals/entities/signal.entity';
import { AnalyzersService } from 'src/modules/analyzers/analyzers.service';

@CommandHandler(TickTradingSessionCommand)
export class TickTradingSessionHandler
  implements ICommandHandler<TickTradingSessionCommand>
{
  private readonly logger = new Logger(TickTradingSessionHandler.name);

  constructor(private analyzersService: AnalyzersService) {}

  async execute(command: TickTradingSessionCommand) {
    const { candlesticks } = command;

    try {
      // Analyze current data

      const actionToPerform: SignalAction = this.analyzersService.analyze(
        this.signals,
        this.operation,
      );

      // Perform action

      if (actionToPerform == SignalAction.NOTHING) {
        return;
      }

      this.logger.log(`Running operation as ${actionToPerform}`);

      // TODO: Parameters refactor
      // this.operation =
      //   await this.backtestOperationsService.createBySignalAction(
      //     this.operation,
      //     {
      //       actionToPerform,
      //       symbol: this.backtest.symbol,
      //       quantity: '0',
      //       backtest: this.backtest,
      //     },
      //     currentCandlesticks[currentCandlesticks.length - 1],
      //   );

      // this.logger.log(`Operation done: ${this.operation.id}`);
    } catch (error) {
      // console.log(error);
      this.logger.log(`Error ${TickTradingSessionHandler.name}`);
    }
  }
}
