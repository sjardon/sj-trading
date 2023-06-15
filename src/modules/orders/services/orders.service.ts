import { ExchangeClientOrderSide } from './../../adapters/exchange/exchange-client.types';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import { OrderEntity } from '../entities/order.entity';
import {
  OrderPositionSide,
  OrderSide,
  OrderType,
} from '../constants/orders.enum.constant';
import { ExchangeClient } from '../../adapters/exchange/exchange.client';
import { CreateOrderDto } from '../dto/create-order.dto';

export type InputOrderOpen = {
  symbol: SymbolType;
  amount: number;
  stopLoss?: number;
};

@Injectable()
export class OrdersService {
  constructor(
    private exchangeClient: ExchangeClient,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  async open({ symbol, amount, stopLoss }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.BUY,
      amount,
      stopLoss,
    });
  }

  async close({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.SELL,
      amount,
    });
  }

  async openLong({ symbol, amount, stopLoss }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.BUY,
      positionSide: OrderPositionSide.LONG,
      amount,
      stopLoss,
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

  async openShort({ symbol, amount, stopLoss }: InputOrderOpen) {
    return await this.create({
      symbol,
      // side: OrderSide.BUY,
      positionSide: OrderPositionSide.SHORT,
      side: OrderSide.SELL,
      // positionSide: OrderPositionSide.LONG,
      amount,
      stopLoss,
    });
  }

  async closeShort({ symbol, amount }: InputOrderOpen) {
    return await this.create({
      symbol,
      side: OrderSide.BUY,
      // positionSide: OrderPositionSide.LONG,
      // side: OrderSide.SELL,
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
    stopLoss,
  }: CreateOrderDto): Promise<OrderEntity> {
    const mappedType = type || OrderType.MARKET;
    const mappedSide =
      side == OrderSide.BUY
        ? ExchangeClientOrderSide.BUY
        : ExchangeClientOrderSide.SELL;

    this.logger.log(
      `Creating [${mappedType}] [${mappedSide}] [${positionSide}] order`,
    );

    try {
      const { amount: formatedAmount, stopLoss: formatedStopLoss } =
        this.formatInputOrder({
          symbol,
          amount,
          stopLoss,
        });
      this.validateInputOrder({
        symbol,
        amount: formatedAmount,
        stopLoss: formatedStopLoss,
      });

      this.logger.log(
        `Order details: amount [${amount}] - stopLoss [${stopLoss}]`,
      );

      return await this.exchangeClient.createOrder({
        symbol,
        type: mappedType,
        side: mappedSide,
        positionSide,
        amount,
        stopLoss,
      });
    } catch (error) {
      throw error;
    }
  }

  formatInputOrder({ symbol, amount, stopLoss }) {
    amount = this.exchangeClient.amountToPrecision(symbol, amount);
    if (stopLoss) {
      stopLoss = this.exchangeClient.amountToPrecision(symbol, stopLoss);
    }
    return { amount, stopLoss };
  }

  validateInputOrder({ symbol, amount, stopLoss }) {
    // Order amount >= limits['amount']['min']
    // Order amount <= limits['amount']['max']
    // Order price >= limits['price']['min']
    // Order price <= limits['price']['max']
    // Order cost (amount * price) >= limits['cost']['min']
    // Order cost (amount * price) <= limits['cost']['max']
    // Precision of amount must be <= precision['amount']
    // Precision of price must be <= precision['price']
    this.exchangeClient.validateCreateOrderAmount(symbol, amount);
    this.exchangeClient.validateCreateOrderAmountPrecision(symbol, amount);
    if (stopLoss) {
      this.exchangeClient.validateCreateOrderAmountPrecision(symbol, stopLoss);
    }
  }
}
