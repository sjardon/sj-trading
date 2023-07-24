import { ConfigService } from '@nestjs/config';
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { InputGetCandlestick } from '../../candlesticks/services/candlestick.interface';
import {
  ExchangeInterface,
  InputWatchCandlesticks,
} from './exchange.interface';

import * as ccxt from 'ccxt';

import { Injectable } from '@nestjs/common';
import { CandlestickIntervalType } from '../../candlesticks/constants/candlestick-interval.enum.constant';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import { OrderEntity } from '../../orders/entities/order.entity';
import {
  InputExchangeClientCancelOrder,
  InputExchangeClientCreateOrder,
} from './exchange-client.types';
import { OrderSide } from '../../orders/constants/orders.enum.constant';
import { BalanceEntity } from '../../balances/entities/balance.entity';

@Injectable()
export class ExchangeClient implements ExchangeInterface {
  private futuresExchangeWatcher: ccxt.pro.binanceusdm;
  private futuresExchange: ccxt.binance;

  constructor(private readonly configService: ConfigService) {
    let apiKey = configService.get<string>('exchange.binance.apiKey');
    let secret = configService.get<string>('exchange.binance.secretKey');

    if (this.configService.get<string>('exchange.env') == 'testing') {
      // apiKey = configService.get<string>('exchange.testnetBinance.apiKey');
      // secret = configService.get<string>('exchange.testnetBinance.secretKey');
    }

    this.futuresExchangeWatcher = new ccxt.pro.binanceusdm({ apiKey, secret });
    // { apiKey, secret }
    this.futuresExchange = new ccxt.binance({ apiKey, secret });
    // { apiKey, secret }

    if (this.configService.get<string>('exchange.env') == 'testing') {
      // this.futuresExchangeWatcher.setSandboxMode(true);
      // this.futuresExchange.setSandboxMode(true);
    }
  }

  async futuresGetCandlesticks({
    symbol,
    interval,
    lookback,
    startTime,
    endTime,
  }: InputGetCandlestick): Promise<CandlestickEntity[]> {
    try {
      startTime = startTime ? +startTime : undefined;

      const OHCLVs = await this.futuresExchange.fetchOHLCV(
        symbol,
        interval,
        startTime,
        lookback,
      );

      return this.mapToCandlesticks(OHCLVs, symbol, interval);
    } catch (thrownError) {
      console.log(thrownError);
      throw new Error('Exchange get futures candlesticks error');
    }
  }

  async futuresWatchCandlesticks({
    symbol,
    interval,
    lookback,
  }: InputWatchCandlesticks): Promise<CandlestickEntity[]> {
    // TODO: Instead of getting OHLCV is so faster get orders and calculate by our own the OHLCV values.
    // We can check this: https://github.com/ccxt/ccxt/wiki/ccxt.pro.manual/986efa88a55b860d6fb966b299ab317fce0997bc#watchohlcv

    try {
      const OHCLVs = await this.futuresExchangeWatcher.watchOHLCV(
        symbol,
        interval,
      );

      // TODO: Instead, return an observer
      return this.mapToCandlesticks(OHCLVs, symbol, interval);
    } catch (error) {
      throw error;
    }
  }

  private mapToCandlesticks(
    OHCLVs: ccxt.OHLCV[],
    symbol: SymbolType,
    interval: CandlestickIntervalType,
  ): CandlestickEntity[] {
    return OHCLVs.map((OHCLV) => {
      const [timestamp, open, high, low, close, volume] = OHCLV;

      return {
        symbol,
        open: +open,
        close: +close,
        high: +high,
        low: +low,
        openTime: timestamp,
        closeTime: timestamp,
        volume: +volume,
        interval,
      } as CandlestickEntity;
    }) as CandlestickEntity[];
  }

  async watchBalances() {
    try {
      return await this.futuresExchangeWatcher.watchBalance();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getBalances() {
    try {
      const balances = await this.futuresExchange.fetchBalance();
      return this.mapToBalances(balances);
    } catch (error) {
      throw error;
    }
  }

  mapToBalances(balances: ccxt.Balances) {
    const { BTC, USDT, datetime } = balances;
    const finalBalances: BalanceEntity[] = [];

    if (BTC) {
      finalBalances.push({
        ...BTC,
        stockSymbol: 'BTC',
        // datetime,
      });
    }

    if (USDT) {
      finalBalances.push({
        ...USDT,
        stockSymbol: 'USDT',
        // datetime,
      });
    }

    return finalBalances;
  }

  async getOrderBook(symbol: SymbolType) {
    try {
      return await this.futuresExchange.fetchOrderBook(symbol);
    } catch (error) {
      throw error;
    }
  }

  async createOrder({
    symbol,
    type,
    side,
    positionSide,
    amount,
    stopLoss,
  }: InputExchangeClientCreateOrder): Promise<OrderEntity> {
    try {
      const params = {
        positionSide,
      };

      // if (stopLoss) {
      //   params['stopLossPrice'] = this.amountToPrecision(symbol, stopLoss);
      // }

      amount = this.amountToPrecision(symbol, amount);
      const createdOrder = await this.futuresExchange.createOrder(
        symbol,
        type,
        side,
        amount,
        undefined,
        params,
      );
      return this.mapToOrder(createdOrder);
    } catch (error) {
      throw error;
    }
  }

  amountToPrecision(symbol: SymbolType, amount: number) {
    const market = this.futuresExchange.market(symbol);
    return +amount.toFixed(market.precision.amount);
  }

  validateCreateOrderAmount(symbol: SymbolType, amount: number) {
    // Order amount >= limits['amount']['min']
    // Order amount <= limits['amount']['max']
    const market = this.futuresExchange.market(symbol);
    if (amount < market.limits.amount.min) {
      throw new Error(
        `Create order error: amount [${amount}] must be greater than [${market.limits.amount.min}]`,
      );
    }
    if (amount > market.limits.amount.max) {
      throw new Error(
        `Create order error: amount [${amount}] must be less than [${market.limits.amount.min}]`,
      );
    }
  }

  validateCreateOrderAmountPrecision(symbol: SymbolType, amount: number) {
    const market = this.futuresExchange.market(symbol);

    let decimalCount = amount.toString().split('.')[1]?.length || 0;
    if (decimalCount > market.precision.amount) {
      throw new Error(
        `Create order error: amount precision [${amount}] must be less than [${market.precision.amount}]`,
      );
    }
  }

  async cancelOrder({
    exchangeOrderId,
    symbol,
  }: InputExchangeClientCancelOrder): Promise<OrderEntity> {
    try {
      const canceledOrder = await this.futuresExchange.cancelOrder(
        exchangeOrderId,
        symbol,
      );

      return this.mapToOrder(canceledOrder);
    } catch (error) {
      throw error;
    }
  }

  private mapToOrder(order: ccxt.Order): OrderEntity {
    const {
      id: exchangeOrderId,
      timestamp,
      datetime,
      status: exchangeOrderStatus,
      symbol,
      type,
      side: exchangeSide,
      price,
      amount,
      info,
    } = order;

    const { positionSide, updatetime } = info;
    const side = exchangeSide == 'buy' ? OrderSide.BUY : OrderSide.SELL;

    const orderTime = timestamp | Date.now();
    const transactTime = new Date(orderTime).toISOString();

    return {
      exchangeOrderId,
      exchangeOrderStatus,
      symbol,
      amount,
      type,
      side,
      positionSide,
      transactTime,
    } as OrderEntity;
  }

  // async futuresGetAccountBalance(): Promise<AccountEntity[]> {
  //   // const accountBalances = await this.binanceClient.futuresAccountBalance();

  //   // return accountBalances.map((accountBalance) => {
  //   //   let { asset, balance } = accountBalance;
  //   //   return new AccountEntity({ asset, balance: +balance });
  //   // });

  //   throw new Error('Not implemented');
  // }

  // async futuresGetOrder({
  //   symbol,
  //   orderId,
  // }: InputFuturesGetOrder): Promise<OrderEntity> {
  //   // try {
  //   //   const searchedOrder = await this.binanceClient.futuresGetOrder({
  //   //     // Any
  //   //     symbol,
  //   //     orderId,
  //   //   });

  //   //   const {
  //   //     symbol: searchedOrderSymbol,
  //   //     orderId: searcherdOrderId,
  //   //     clientOrderId,
  //   //     price,
  //   //     origQty,
  //   //     amount,
  //   //     status,
  //   //     timeInForce,
  //   //     type,
  //   //     side,
  //   //     updateTime: transactTime,
  //   //   } = searchedOrder;

  //   //   return new OrderEntity({
  //   //     symbol: searchedOrderSymbol,
  //   //     orderId: searcherdOrderId.toString(),
  //   //     clientOrderId,
  //   //     price: +price,
  //   //     origQty: +origQty,
  //   //     amount: +amount,
  //   //     status,
  //   //     timeInForce,
  //   //     type,
  //   //     side,
  //   //     transactTime,
  //   //   });
  //   // } catch (thrownError) {
  //   //   throw new Error('Method not implemented.');
  //   // }

  //   throw new Error('Not implemented');
  // }

  // async futuresGetOpenOrders({
  //   symbol,
  // }: InputFuturesGetOpenOrders): Promise<OrderEntity[]> {
  //   // try {
  //   //   const searchedOrders = await this.binanceClient.futuresOpenOrders({
  //   //     // Any
  //   //     symbol,
  //   //   });

  //   //   return searchedOrders.map((order) => {
  //   //     const {
  //   //       symbol: searchedOrderSymbol,
  //   //       orderId,
  //   //       clientOrderId,
  //   //       price,
  //   //       origQty,
  //   //       amount,
  //   //       status,
  //   //       timeInForce,
  //   //       type,
  //   //       side,
  //   //       updateTime: transactTime,
  //   //     } = order;

  //   //     return new OrderEntity({
  //   //       symbol,
  //   //       orderId: orderId.toString(),
  //   //       clientOrderId,
  //   //       price: +price,
  //   //       origQty: +origQty,
  //   //       amount: +amount,
  //   //       status,
  //   //       timeInForce,
  //   //       type,
  //   //       side,
  //   //       transactTime,
  //   //     });
  //   //   });
  //   // } catch (thrownError) {
  //   //   throw new Error('Method not implemented.');
  //   // }

  //   throw new Error('Not implemented');
  // }

  // async futuresCreateOrder({
  //   symbol,
  //   side,
  //   positionSide,
  //   quantity,
  //   stopLoss,
  // }: InputFuturesCreateOrder): Promise<OrderEntity> {
  //   // try {
  //   //   const order = {
  //   //     symbol,
  //   //     side,
  //   //     positionSide,
  //   //     quantity: decimalAdjust(+quantity, 0).toString(),
  //   //     // stopPrice: decimalAdjust(stopLoss, 2),
  //   //     type: 'MARKET',
  //   //   } as NewFuturesOrder;

  //   //   const {
  //   //     symbol: createdOrderSymbol,
  //   //     orderId,
  //   //     clientOrderId,
  //   //     price,
  //   //     origQty,
  //   //     amount,
  //   //     status,
  //   //     timeInForce,
  //   //     type,
  //   //     side: createdOrderSide,
  //   //     updateTime: transactTime,
  //   //   } = await this.binanceClient.futuresOrder(order); // Any

  //   //   return new OrderEntity({
  //   //     symbol,
  //   //     orderId: orderId.toString(),
  //   //     clientOrderId,
  //   //     price: +price,
  //   //     origQty: +origQty,
  //   //     amount: +amount,
  //   //     status,
  //   //     timeInForce,
  //   //     type,
  //   //     side,
  //   //     transactTime,
  //   //   });
  //   // } catch (thrownError) {
  //   //   console.error('CREATE ORDER ERROR');
  //   //   throw thrownError;
  //   // }

  //   throw new Error('Not implemented');
  // }

  // async futuresCancelOrder({
  //   symbol,
  //   orderId,
  // }: InputFuturesCancelOrder): Promise<OrderEntity> {
  //   // try {
  //   //   const {
  //   //     symbol: canceledOrderSymbol,
  //   //     orderId: canceledOrderId,
  //   //     clientOrderId,
  //   //     price,
  //   //     origQty,
  //   //     amount,
  //   //     status,
  //   //     timeInForce,
  //   //     type,
  //   //     side,
  //   //   } = await this.binanceClient.futuresCancelOrder({
  //   //     // Any
  //   //     symbol,
  //   //     orderId,
  //   //   });

  //   //   return new OrderEntity({
  //   //     symbol,
  //   //     orderId: orderId.toString(),
  //   //     clientOrderId,
  //   //     price: +price,
  //   //     origQty: +origQty,
  //   //     amount: +amount,
  //   //     status,
  //   //     timeInForce,
  //   //     type,
  //   //     side,
  //   //   });
  //   // } catch (thrownError) {
  //   //   console.error('CANCEL ORDER ERROR');
  //   //   throw thrownError;
  //   // }
  //   throw new Error('Not implemented');
  // }

  // async getCandlesticks({
  //   symbol,
  //   interval,
  //   lookback,
  //   startTime,
  //   endTime,
  // }: InputGetCandlestick): Promise<CandlestickEntity[]> {
  //   try {
  //     const candlesticks = await this.exchange.fetchOHLCV(
  //       symbol,
  //       interval,
  //       +startTime,
  //       lookback,
  //     );

  //     return candlesticks.map((candlestick) => {
  //       const [timestamp, open, high, low, close, volume] = candlestick;

  //       return {
  //         symbol,
  //         open: +open,
  //         close: +close,
  //         high: +high,
  //         low: +low,
  //         openTime: timestamp,
  //         closeTime: timestamp,
  //         volume: +volume,
  //         interval,
  //       } as CandlestickEntity;
  //     });
  //   } catch (thrownError) {
  //     throw new Error('Exchange get candlesticks error');
  //   }
  // }
}
