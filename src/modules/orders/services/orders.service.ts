import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { CandlestickSymbolType } from '../../candlesticks/intervals/candlestick-interval.type';
import { SignalAction } from '../../strategies/signals/entities/signal.entity';
import { OrderEntity } from '../entities/order.entity';
import {
  OrderPositionSide,
  OrderSide,
} from '../constants/orders.enum.constant';

export type InputCreateOrder = {
  actionToPerform: SignalAction;
  symbol: CandlestickSymbolType;
  quantity: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
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
      const newOrder = this.ordersRepository.create({
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
