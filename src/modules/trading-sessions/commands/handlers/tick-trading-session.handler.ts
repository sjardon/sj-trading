import { RiskAnalysisService } from './../../../risk-analysis/services/risk-analysis.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TickTradingSessionCommand } from '../impl/tick-trading-session.command';
import { Logger } from '@nestjs/common';
import { SignalAction } from 'src/modules/strategies/signals/entities/signal.entity';
import { AnalyzersService } from 'src/modules/analyzers/analyzers.service';
import { ReferenceVisitor } from 'src/common/visitors/reference.visitor';
import { OperationsService } from 'src/modules/operations/services/operations.service';
import { BalancesService } from 'src/modules/balances/services/balances.service';
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
    private balancesService: BalancesService,
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
    const { symbol } = tradingSession;

    try {
      // Analyze current data

      const balances = await this.balancesService.get();
      console.log('balance', balances);

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

      this.logger.log(`Running operation as ${actionToPerform}`);
      // evaluate by risk-analysis
      // Get amount

      if (
        [
          SignalAction.BUY,
          SignalAction.OPEN_LONG,
          SignalAction.OPEN_SHORT,
        ].includes(actionToPerform)
      ) {
        if (!this.riskAnalysisService.analyze(symbol)) {
          return;
        }

        const amount = await this.riskAnalysisService.getAmount(symbol);
      }

      if (
        [
          SignalAction.SELL,
          SignalAction.CLOSE_LONG,
          SignalAction.CLOSE_SHORT,
        ].includes(actionToPerform)
      ) {
        this.executeSellAction();
      }

      // this.logger.log(`Operation done: ${this.operation.id}`);
    } catch (error) {
      console.log(error);
      this.logger.log(`Error ${TickTradingSessionHandler.name}`);
    }
  }

  executeSellAction() {
    throw new Error('Method not implemented.');
  }
}
