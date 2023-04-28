import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignalAction } from 'src/strategies/signals/entities/signal.entity';
import { Repository } from 'typeorm';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import {
  BacktestOrdersService,
  InputCreateOrder,
} from '../backtest-orders/backtest-orders.service';
import { BacktestOrderEntity } from '../backtest-orders/entities/backtest-order.entity';
import { BacktestEntity } from '../entities/backtest.entity';

import { BacktestOperationEntity } from './entities/backtest-operation.entity';

export type InputCreateOperationBySignalAction = InputCreateOrder & {
  backtest: BacktestEntity;
};

@Injectable()
export class BacktestOperationsService {
  private readonly logger = new Logger(BacktestOperationsService.name);

  constructor(
    private backtestOrdersService: BacktestOrdersService,
    @InjectRepository(BacktestOperationEntity)
    private backtestOperationsRepository: Repository<BacktestOperationEntity>,
  ) {}

  async createBySignalAction(
    lastBacktestOperation: BacktestOperationEntity,
    inputCreateOperationBySignalAction: InputCreateOperationBySignalAction,
    candlestick?: CandlestickEntity,
  ) {
    const { backtest, ...inputCreateOrder } =
      inputCreateOperationBySignalAction;

    const { actionToPerform } = inputCreateOrder;

    this.validateOrderToCreate(lastBacktestOperation, actionToPerform);

    lastBacktestOperation = this.createIfNotExists(
      lastBacktestOperation,
      backtest,
    );

    if (SignalAction.BUY == actionToPerform) {
      lastBacktestOperation.openOrder = await this.backtestOrdersService.open(
        inputCreateOrder,
        candlestick,
      );
    }

    if (SignalAction.SELL == actionToPerform) {
      lastBacktestOperation.closeOrder = await this.backtestOrdersService.close(
        inputCreateOrder,
        candlestick,
      );
    }

    if (SignalAction.OPEN_LONG == actionToPerform) {
      lastBacktestOperation.openOrder =
        await this.backtestOrdersService.openLong(
          inputCreateOrder,
          candlestick,
        );
    }

    if (SignalAction.CLOSE_LONG == actionToPerform) {
      lastBacktestOperation.closeOrder =
        await this.backtestOrdersService.closeLong(
          inputCreateOrder,
          candlestick,
        );
    }

    if (SignalAction.OPEN_SHORT == actionToPerform) {
      lastBacktestOperation.openOrder =
        await this.backtestOrdersService.openShort(
          inputCreateOrder,
          candlestick,
        );
    }

    if (SignalAction.CLOSE_SHORT == actionToPerform) {
      lastBacktestOperation.closeOrder =
        await this.backtestOrdersService.closeShort(
          inputCreateOrder,
          candlestick,
        );
    }

    return await this.backtestOperationsRepository.save(lastBacktestOperation);
  }

  private createIfNotExists(
    backtestOperation: BacktestOperationEntity,
    backtest: BacktestEntity,
  ): BacktestOperationEntity {
    if (
      !backtestOperation ||
      (backtestOperation && backtestOperation.isClose())
    ) {
      return this.backtestOperationsRepository.create({
        backtest,
      });
    }

    return backtestOperation;
  }

  private validateOrderToCreate(
    lastBacktestOperation: BacktestOperationEntity,
    actionToPerform: SignalAction,
  ) {
    if (
      [
        SignalAction.BUY,
        SignalAction.OPEN_SHORT,
        SignalAction.OPEN_LONG,
      ].includes(actionToPerform) &&
      lastBacktestOperation &&
      lastBacktestOperation.isOpen() &&
      !lastBacktestOperation.isClose()
    ) {
      throw Error('Operation is alredy open');
    }

    if (
      [
        SignalAction.SELL,
        SignalAction.CLOSE_SHORT,
        SignalAction.CLOSE_LONG,
      ].includes(actionToPerform) &&
      lastBacktestOperation &&
      !lastBacktestOperation.isOpen()
    ) {
      throw Error('Operation is not open');
    }

    if (
      SignalAction.SELL == actionToPerform &&
      lastBacktestOperation &&
      !lastBacktestOperation.isBoth()
    ) {
      throw Error('Operation is not buy / sell');
    }

    if (
      SignalAction.CLOSE_SHORT == actionToPerform &&
      lastBacktestOperation &&
      !lastBacktestOperation.isShort()
    ) {
      throw Error('Operation is not long');
    }

    if (
      SignalAction.CLOSE_LONG == actionToPerform &&
      lastBacktestOperation &&
      !lastBacktestOperation.isLong()
    ) {
      throw Error('Operation is not long');
    }
  }

  async getAllByBacktest(backtestId: string) {
    return await this.backtestOperationsRepository.find({
      relations: {
        openOrder: true,
        closeOrder: true,
      },
      where: {
        backtest: {
          id: backtestId,
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
