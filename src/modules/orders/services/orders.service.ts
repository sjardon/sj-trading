import { ExchangeClientOrderSide } from './../../adapters/exchange/exchange-client.types';
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
  OrderType,
} from '../constants/orders.enum.constant';
import { ExchangeClient } from 'src/modules/adapters/exchange/exchange.client';
import { CreateOrderDto } from '../dto/create-order.dto';

type InputOrderOpen = {
  symbol: CandlestickSymbolType;
  amount: number;
};

@Injectable()
export class OrdersService {
  constructor(
    private exchangeClient: ExchangeClient,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {}

  async open({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.BUY,
      amount,
    });
  }

  async close({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.SELL,
      amount,
    });
  }

  async openLong({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.BUY,
      positionSide: OrderPositionSide.LONG,
      amount,
    });
  }

  async closeLong({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.SELL,
      positionSide: OrderPositionSide.LONG,
      amount,
    });
  }

  async openShort({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.BUY,
      positionSide: OrderPositionSide.SHORT,
      amount,
    });
  }

  async closeShort({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.SELL,
      positionSide: OrderPositionSide.SHORT,
      amount,
    });
  }

  async create({
    symbol,
    type,
    side,
    positionSide,
    amount,
  }: CreateOrderDto): Promise<OrderEntity> {
    const mappedType = type || OrderType.MARKET;
    const mappedSide =
      side == OrderSide.BUY
        ? ExchangeClientOrderSide.BUY
        : ExchangeClientOrderSide.SELL;

    try {
      return await this.exchangeClient.createOrder({
        symbol,
        type: mappedType,
        side: mappedSide,
        positionSide,
        amount,
      });
    } catch (error) {
      throw error;
    }
  }
}
