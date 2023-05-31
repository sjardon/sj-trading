import { InputCreateOrder } from './../../backtests/backtest-orders/backtest-orders.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignalAction } from '../../strategies/signals/entities/signal.entity';
import { Repository } from 'typeorm';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import {
  InputOrderOpen,
  OrdersService,
} from '../../orders/services/orders.service';
import { OperationEntity } from '../entities/operation.entity';
import { TradingSessionEntity } from 'src/modules/trading-sessions/entities/trading-session.entity';
import { SymbolType } from 'src/common/helpers/services/symbols/constants/symbol.enum.constant';

export type InputCreateOperationBySignalAction = {
  tradingSession: TradingSessionEntity;
  actionToPerform: SignalAction;
  amount?: number;
};

@Injectable()
export class OperationsService {
  private readonly logger = new Logger(OperationsService.name);

  constructor(
    private ordersService: OrdersService,
    @InjectRepository(OperationEntity)
    private operationsRepository: Repository<OperationEntity>,
  ) {}

  async createBySignalAction(
    lastOperation: OperationEntity,
    inputCreateOperationBySignalAction: InputCreateOperationBySignalAction,
  ) {
    const { tradingSession, actionToPerform, amount } =
      inputCreateOperationBySignalAction;

    const { symbol } = tradingSession;

    this.validateOrderToCreate(lastOperation, actionToPerform);

    lastOperation = this.createIfNotExists(lastOperation, tradingSession);

    if (SignalAction.NOTHING == actionToPerform) {
      return lastOperation;
    }

    if (SignalAction.BUY == actionToPerform) {
      lastOperation.openOrder = await this.ordersService.open({
        amount,
        symbol,
      });
    }

    if (SignalAction.SELL == actionToPerform) {
      const { amount } = lastOperation.openOrder;
      lastOperation.closeOrder = await this.ordersService.close({
        symbol,
        amount,
      });
    }

    if (SignalAction.OPEN_LONG == actionToPerform) {
      lastOperation.openOrder = await this.ordersService.openLong({
        symbol,
        amount,
      });
    }

    if (SignalAction.CLOSE_LONG == actionToPerform) {
      const { amount } = lastOperation.openOrder;
      lastOperation.closeOrder = await this.ordersService.closeLong({
        symbol,
        amount,
      });
    }

    if (SignalAction.OPEN_SHORT == actionToPerform) {
      lastOperation.openOrder = await this.ordersService.openShort({
        symbol,
        amount,
      });
    }

    if (SignalAction.CLOSE_SHORT == actionToPerform) {
      const { amount } = lastOperation.openOrder;
      lastOperation.closeOrder = await this.ordersService.closeShort({
        symbol,
        amount,
      });
    }

    return await this.operationsRepository.save(lastOperation);
  }

  private createIfNotExists(
    operation: OperationEntity,
    tradingSession: TradingSessionEntity,
  ): OperationEntity {
    if (!operation || (operation && operation.isClose())) {
      return this.operationsRepository.create({
        tradingSession,
      });
    }

    return operation;
  }

  private validateOrderToCreate(
    lastOperation: OperationEntity,
    actionToPerform: SignalAction,
  ) {
    if (
      [
        SignalAction.BUY,
        SignalAction.OPEN_SHORT,
        SignalAction.OPEN_LONG,
      ].includes(actionToPerform) &&
      lastOperation &&
      lastOperation.isOpen() &&
      !lastOperation.isClose()
    ) {
      throw Error('Operation is alredy open');
    }

    if (
      [
        SignalAction.SELL,
        SignalAction.CLOSE_SHORT,
        SignalAction.CLOSE_LONG,
      ].includes(actionToPerform) &&
      lastOperation &&
      !lastOperation.isOpen()
    ) {
      throw Error('Operation is not open');
    }

    if (
      SignalAction.SELL == actionToPerform &&
      lastOperation &&
      !lastOperation.isBoth()
    ) {
      throw Error('Operation is not buy / sell');
    }

    if (
      SignalAction.CLOSE_SHORT == actionToPerform &&
      lastOperation &&
      !lastOperation.isShort()
    ) {
      throw Error('Operation is not long');
    }

    if (
      SignalAction.CLOSE_LONG == actionToPerform &&
      lastOperation &&
      !lastOperation.isLong()
    ) {
      throw Error('Operation is not long');
    }
  }

  async getAllByTradingSession(tradingSessionId: string) {
    return await this.operationsRepository.find({
      relations: {
        openOrder: true,
        closeOrder: true,
      },
      where: {
        tradingSession: {
          id: tradingSessionId,
        },
      },
      order: {
        openOrder: {
          transactTime: 'ASC',
        },
      },
    });
  }
}
