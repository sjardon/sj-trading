import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignalAction } from '../../strategies/signals/entities/signal.entity';
import { Repository } from 'typeorm';
import { OrdersService } from '../../orders/services/orders.service';
import { OperationEntity } from '../entities/operation.entity';
import { TradingSessionEntity } from '../../trading-sessions/entities/trading-session.entity';

export type InputCreateOperationBySignalAction = {
  tradingSession: TradingSessionEntity;
  actionToPerform: SignalAction;
  amount?: number;
  stopLoss?: number;
  takeProfit?: number;
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
    const { tradingSession, actionToPerform, amount, stopLoss } =
      inputCreateOperationBySignalAction;

    const { symbol } = tradingSession;

    this.validateOrderToCreate(lastOperation, actionToPerform);

    lastOperation = this.createIfNotExists(lastOperation, tradingSession);

    this.logger.log(`Operation ${amount} ${stopLoss}`);

    if (SignalAction.NOTHING == actionToPerform) {
      return lastOperation;
    }

    if (SignalAction.BUY == actionToPerform) {
      const stopLossPrice = amount * (1 - stopLoss);
      lastOperation.openOrder = await this.ordersService.open({
        amount,
        symbol,
        stopLoss: stopLossPrice,
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
      const stopLossPrice = amount * (1 - stopLoss);
      lastOperation.openOrder = await this.ordersService.openLong({
        symbol,
        amount,
        stopLoss: stopLossPrice,
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
      const stopLossPrice = amount * (1 + stopLoss);
      lastOperation.openOrder = await this.ordersService.openShort({
        symbol,
        amount,
        stopLoss: stopLossPrice,
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
