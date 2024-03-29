import { Injectable } from '@nestjs/common';
import {
  SignalAction,
  SignalEntity,
} from '../strategies/signals/entities/signal.entity';
import { SignalsService } from '../strategies/signals/signals.service';
import { BacktestOperationEntity } from '../backtests/backtest-operations/entities/backtest-operation.entity';
import { OperationEntityAbstract } from '../operations/entities/operation.entity.abstract';

@Injectable()
export class AnalyzersService {
  constructor(private signalsService: SignalsService) {}

  // TODO: Use an abstract or base orderEntity instead

  analyze(
    signals: SignalEntity[],
    operation?: OperationEntityAbstract,
  ): SignalAction {
    const searchedSignalsActions = this.getSearchedSignalsActions(operation);

    const signalsToExecute = signals.filter((signal) =>
      searchedSignalsActions.includes(signal.action),
    );

    for (const signal of signalsToExecute) {
      const signalExecutionResult = this.signalsService.exec(signal);

      if (signalExecutionResult) {
        return signal.action;
      }
    }

    return SignalAction.NOTHING;
  }

  private getSearchedSignalsActions(
    operation?: OperationEntityAbstract,
  ): SignalAction[] {
    const searchedSignalsActions = [];

    if (operation && operation.isOpen() && !operation.isClose()) {
      if (operation.isLong()) {
        searchedSignalsActions.push(SignalAction.CLOSE_LONG);
      } else if (operation.isShort()) {
        searchedSignalsActions.push(SignalAction.CLOSE_SHORT);
      } else if (operation.isBoth()) {
        searchedSignalsActions.push(SignalAction.SELL);
      }
    } else {
      searchedSignalsActions.push(
        SignalAction.BUY,
        SignalAction.OPEN_SHORT,
        SignalAction.OPEN_LONG,
      );
    }

    return searchedSignalsActions;
  }
}
