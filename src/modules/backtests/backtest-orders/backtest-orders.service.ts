import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import { SignalAction } from '../../strategies/signals/entities/signal.entity';
import {
  BacktestOrderEntity,
  OrderPositionSide,
  OrderSide,
} from './entities/backtest-order.entity';

export type InputCreateOrder = {
  actionToPerform: SignalAction;
  symbol: SymbolType;
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
      symbol: SymbolType;
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
      symbol: SymbolType;
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
      symbol: SymbolType;
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
      symbol: SymbolType;
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
      symbol: SymbolType;
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
      symbol: SymbolType;
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
      symbol: SymbolType;
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
        // amount: +quantity,
        amount: candlestick.close,
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
