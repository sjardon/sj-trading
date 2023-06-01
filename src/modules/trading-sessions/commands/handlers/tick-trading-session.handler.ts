import { RiskAnalysisService } from './../../../risk-analysis/services/risk-analysis.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TickTradingSessionCommand } from '../impl/tick-trading-session.command';
import { Logger } from '@nestjs/common';
import { SignalAction } from 'src/modules/strategies/signals/entities/signal.entity';
import { AnalyzersService } from 'src/modules/analyzers/analyzers.service';
import { ReferenceVisitor } from 'src/common/visitors/reference.visitor';
import { OperationsService } from 'src/modules/operations/services/operations.service';
import { OperationEntity } from 'src/modules/operations/entities/operation.entity';

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
      operation,
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
          operation,
          takeProfit,
          stopLoss,
        }),
      );

      // TODO: IMPORTANT FEATURE - add actionExecutorModule to handle differents actions and validate it.
      // On this way I can create a lot of actions like MODIFY_STOP_LOSS, MODIFY_TAKE_PROFIT, etc.
      // Also, operations will handle not only open and close orders, but a set of orders like take profits, stop loss, more than one open order and so on.

      const actionToPerform: SignalAction = this.analyzersService.analyze(
        signals,
        operation,
      );

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
      console.log(error);
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
