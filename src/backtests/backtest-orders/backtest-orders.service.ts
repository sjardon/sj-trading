import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandlestickEntity } from 'src/candlesticks/entities/candlestick.entity';
import { CandlestickSymbolType } from 'src/candlesticks/intervals/candlestick-interval.type';
import { SignalAction } from 'src/strategies/signals/entities/signal.entity';
import { Repository } from 'typeorm';
import { BacktestEntity } from '../entities/backtest.entity';
import {
  BacktestOrderEntity,
  OrderPositionSide,
  OrderSide,
} from './entities/backtest-order.entity';

export type InputCreateOrder = {
  actionToPerform: SignalAction;
  symbol: CandlestickSymbolType;
  quantity: string;
};

@Injectable()
export class BacktestOrdersService {
  constructor(
    @InjectRepository(BacktestOrderEntity)
    private backtestOrdersRepository: Repository<BacktestOrderEntity>,
  ) {}

  async open(
    inputFuturesOpenLongOrder: {
      symbol: CandlestickSymbolType;
      quantity: string;
    },
    candlestick?: CandlestickEntity,
  ) {
    return await this.create(
      {
        ...inputFuturesOpenLongOrder,
        side: OrderSide.BUY,
        positionSide: OrderPositionSide.BOTH,
      },
      candlestick,
    );
  }

  async close(
    inputFuturesOpenLongOrder: {
      symbol: CandlestickSymbolType;
      quantity: string;
    },
    candlestick?: CandlestickEntity,
  ) {
    return await this.create(
      {
        ...inputFuturesOpenLongOrder,
        side: OrderSide.SELL,
        positionSide: OrderPositionSide.BOTH,
      },
      candlestick,
    );
  }

  async openLong(
    inputFuturesOpenLongOrder: {
      symbol: CandlestickSymbolType;
      quantity: string;
    },
    candlestick?: CandlestickEntity,
  ) {
    return await this.create(
      {
        ...inputFuturesOpenLongOrder,
        side: OrderSide.BUY,
        positionSide: OrderPositionSide.LONG,
      },
      candlestick,
    );
  }

  async closeLong(
    inputFuturesOpenLongOrder: {
      symbol: CandlestickSymbolType;
      quantity: string;
    },
    candlestick?: CandlestickEntity,
  ) {
    return await this.create(
      {
        ...inputFuturesOpenLongOrder,
        side: OrderSide.SELL,
        positionSide: OrderPositionSide.LONG,
      },
      candlestick,
    );
  }

  async openShort(
    inputFuturesOpenLongOrder: {
      symbol: CandlestickSymbolType;
      quantity: string;
    },
    candlestick?: CandlestickEntity,
  ) {
    return await this.create(
      {
        ...inputFuturesOpenLongOrder,
        side: OrderSide.BUY,
        positionSide: OrderPositionSide.SHORT,
      },
      candlestick,
    );
  }

  async closeShort(
    inputFuturesOpenLongOrder: {
      symbol: CandlestickSymbolType;
      quantity: string;
    },
    candlestick?: CandlestickEntity,
  ) {
    return await this.create(
      {
        ...inputFuturesOpenLongOrder,
        side: OrderSide.SELL,
        positionSide: OrderPositionSide.SHORT,
      },
      candlestick,
    );
  }

  async create(
    inputFuturesCreateOrder: {
      symbol: CandlestickSymbolType;
      side: OrderSide;
      positionSide: OrderPositionSide;
      quantity: string;
      stopLoss?: number;
    },
    candlestick?: CandlestickEntity,
  ) {
    const { symbol, side, positionSide, quantity, stopLoss } =
      inputFuturesCreateOrder;
    try {
      const newOrder = this.backtestOrdersRepository.create({
        symbol,
        // executedQty: +quantity,
        executedQty: candlestick.close,
        type: 'TRAILING_STOP_MARKET',
        side,
        positionSide,
        transactTime: candlestick?.closeTime.toString() || '0',
      });

      return await newOrder.save();
    } catch (error) {
      console.error('CREATE ORDER ERROR', error);
      throw error;
    }
  }
}
