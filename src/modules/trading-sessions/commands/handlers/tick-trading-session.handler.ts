import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TickTradingSessionCommand } from '../impl/tick-trading-session.command';
import { Logger } from '@nestjs/common';
import { SignalAction } from 'src/modules/strategies/signals/entities/signal.entity';
import { AnalyzersService } from 'src/modules/analyzers/analyzers.service';
import { ReferenceVisitor } from 'src/common/visitors/reference.visitor';
import { OperationsService } from 'src/modules/operations/services/operations.service';

@CommandHandler(TickTradingSessionCommand)
export class TickTradingSessionHandler
  implements ICommandHandler<TickTradingSessionCommand>
{
  private readonly logger = new Logger(TickTradingSessionHandler.name);

  constructor(
    private analyzersService: AnalyzersService,
    private operationsService: OperationsService,
  ) {}

  async execute(command: TickTradingSessionCommand) {
    const {
      tradingSession,
      signals,
      candlesticks,
      operation,
      strategy,
      referenceContext,
      indicatorExecutors,
    } = command;

    const { takeProfit, stopLoss } = strategy;

    try {
      // Analyze current data

      const indicators = indicatorExecutors.map((indicatorExecutor) =>
        indicatorExecutor.exec(candlesticks),
      );

      // TODO: Save timeframes in an event.

      referenceContext.addReference(
        new ReferenceVisitor({
          timeframes: [],
          candlesticks,
          indicators,
          operation,
          takeProfit,
          stopLoss,
        }),
      );
      const actionToPerform: SignalAction = this.analyzersService.analyze(
        signals,
        operation,
      );

      if (actionToPerform == SignalAction.NOTHING) {
        return;
      }

      this.logger.log(`Running operation as ${actionToPerform}`);

      // TODO: Parameters refactor
      // const createdOperation =
      //   await this.operationsService.createBySignalAction(
      //     operation,
      //     {
      //       actionToPerform,
      //       symbol: tradingSession.symbol,
      //       quantity: '0',
      //       tradingSession,
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
