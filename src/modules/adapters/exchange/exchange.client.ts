// import { Binance, NewFuturesOrder } from "binance-api-node";
// import { Subject } from "rxjs";
// import { AccountEntity } from "../../account/account.entity";
import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';
import { InputGetCandlestick } from '../../candlesticks/services/candlestick.interface';
// import { OrderEntity } from "../../order/order.entity";
// import { decimalAdjust } from "../../utilities/decimal-adjust.util";
import {
  ExchangeInterface,
  InputFuturesCancelOrder,
  // InputFuturesCreateOrder,
  InputFuturesGetOpenOrders,
  InputFuturesGetOrder,
  InputWatchCandlesticks,
} from './exchange.interface';

import * as ccxt from 'ccxt';

import { Injectable } from '@nestjs/common';
import {
  CandlestickIntervalType,
  CandlestickSymbolType,
} from 'src/modules/candlesticks/intervals/candlestick-interval.type';

@Injectable()
export class ExchangeClient implements ExchangeInterface {
  private exchangeWatcher = new ccxt.pro.binance({
    options: {
      tradesLimit: 1000,
      OHLCVLimit: 1000,
      ordersLimit: 1000,
    },
    newUpdates: true,
  });
  private exchange = new ccxt.binance();
  private futuresExchange = new ccxt.binance({
    options: { defaultType: 'future' },
  });

  async getCandlesticks({
    symbol,
    interval,
    lookback,
    startTime,
    endTime,
  }: InputGetCandlestick): Promise<CandlestickEntity[]> {
    try {
      const candlesticks = await this.exchange.fetchOHLCV(
        symbol,
        interval,
        +startTime,
        lookback,
      );

      return candlesticks.map((candlestick) => {
        const [timestamp, open, high, low, close, volume] = candlestick;

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
      });
    } catch (thrownError) {
      throw new Error('Exchange get candlesticks error');
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
      console.log(startTime);
      const OHCLVs = await this.futuresExchange.fetchOHLCV(
        symbol,
        interval,
        startTime,
        lookback,
      );

      return this.mapToCandlesticks(OHCLVs, symbol, interval);
    } catch (thrownError) {
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

    const OHCLVs = await this.exchangeWatcher.watchOHLCV(symbol, interval);

    // TODO: Instead, return an observer
    return this.mapToCandlesticks(OHCLVs, symbol, interval);
  }

  private mapToCandlesticks(
    OHCLVs: ccxt.OHLCV[],
    symbol: CandlestickSymbolType,
    interval: CandlestickIntervalType,
  ) {
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
      };
    }) as CandlestickEntity[];
  }

  // realTimeCandlestick({
  //   symbols,
  //   interval,
  // }: InputRealTimeCandlesticks): Subject<CandlestickEntity> {
  //   // const subject = new Subject<CandlestickEntity>();

  //   // this.binanceClient.ws.candles(symbols, interval, (candlestick) => {
  //   //   // any
  //   //   if (candlestick) {
  //   //     const { symbol, open, close, high, low, startTime, closeTime, volume } =
  //   //       candlestick;

  //   //     subject.next(
  //   //       new CandlestickEntity({
  //   //         symbol,
  //   //         open: +open,
  //   //         close: +close,
  //   //         high: +high,
  //   //         low: +low,
  //   //         openTime: startTime,
  //   //         closeTime,
  //   //         volume: +volume,
  //   //       }),
  //   //     );
  //   //   }
  //   // });

  //   // return subject;
  //   throw new Error('Not implemented');
  // }

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
  //   //     executedQty,
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
  //   //     executedQty: +executedQty,
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
  //   //       executedQty,
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
  //   //       executedQty: +executedQty,
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
  //   //     executedQty,
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
  //   //     executedQty: +executedQty,
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
  //   //     executedQty,
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
  //   //     executedQty: +executedQty,
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
}
