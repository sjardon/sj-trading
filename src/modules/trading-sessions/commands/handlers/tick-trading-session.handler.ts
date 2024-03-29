import { RiskAnalysisService } from './../../../risk-analysis/services/risk-analysis.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TickTradingSessionCommand } from '../impl/tick-trading-session.command';
import { Logger } from '@nestjs/common';
import { SignalAction } from '../../../strategies/signals/entities/signal.entity';
import { AnalyzersService } from '../../../analyzers/analyzers.service';
import { ReferenceVisitor } from '../../../../common/visitors/reference.visitor';
import { OperationsService } from '../../../operations/services/operations.service';
import { OperationEntity } from '../../../operations/entities/operation.entity';

@CommandHandler(TickTradingSessionCommand)
export class TickTradingSessionHandler
  implements ICommandHandler<TickTradingSessionCommand>
{
  private readonly logger = new Logger(TickTradingSessionHandler.name);
  private lastOperation: OperationEntity;

  constructor(
    private analyzersService: AnalyzersService,
    private riskAnalysisService: RiskAnalysisService,
    private operationsService: OperationsService,
  ) {}

  async execute(command: TickTradingSessionCommand) {
    const {
      tradingSession,
      signals,
      candlesticks,
      strategy,
      referenceContext,
      indicatorExecutors,
    } = command;

    let { takeProfit, stopLoss } = strategy;

    const { symbol } = tradingSession;

    try {
      // Analyze current data

      const indicators = indicatorExecutors.map((indicatorExecutor) =>
        indicatorExecutor.exec(candlesticks),
      );

      // TODO: Save timeframes in event.

      referenceContext.addReference(
        new ReferenceVisitor({
          timeframes: [],
          candlesticks,
          indicators,
          operation: this.lastOperation,
          takeProfit,
          stopLoss,
        }),
      );

      // TODO: IMPORTANT FEATURE - add actionExecutorModule to handle differents actions and validate it.
      // On this way I would be able to create a lot of actions like MODIFY_STOP_LOSS, MODIFY_TAKE_PROFIT, etc.
      // Also, operations would handle, not only open and close orders, but a set of orders like take profits, stop loss, more than one open order and so on.

      const actionToPerform: SignalAction = this.analyzersService.analyze(
        signals,
        this.lastOperation,
      );

      // From here: ActionExecutorModule

      if (actionToPerform == SignalAction.NOTHING) {
        return;
      }

      this.logger.log(`Running action: ${actionToPerform}`);

      if (this.isOpenAction(actionToPerform)) {
        if (!this.riskAnalysisService.analyze(symbol)) {
          return;
        }

        const amount = await this.riskAnalysisService.getAmount(symbol);

        this.lastOperation = await this.operationsService.createBySignalAction(
          this.lastOperation,
          {
            tradingSession,
            actionToPerform,
            amount,
            stopLoss,
          },
        );
      }

      if (this.isCloseAction(actionToPerform)) {
        this.lastOperation = await this.operationsService.createBySignalAction(
          this.lastOperation,
          {
            tradingSession,
            actionToPerform,
          },
        );
      }
    } catch (error) {
      this.logger.log(`Error ${TickTradingSessionHandler.name}`);
    }
  }

  isOpenAction(actionToPerform: SignalAction) {
    return [
      SignalAction.BUY,
      SignalAction.OPEN_LONG,
      SignalAction.OPEN_SHORT,
    ].includes(actionToPerform);
  }

  isCloseAction(actionToPerform: SignalAction) {
    return [
      SignalAction.SELL,
      SignalAction.CLOSE_LONG,
      SignalAction.CLOSE_SHORT,
    ].includes(actionToPerform);
  }
}
