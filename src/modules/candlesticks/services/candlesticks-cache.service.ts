import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { CandlestickEntity } from '../entities/candlestick.entity';
import {
  CandlestickIntervalType,
  CandlestickSymbolType,
} from '../intervals/candlestick-interval.type';

import { MAX_CACHED_CANDLESTICKS } from '../constants/candlesticks-cache.constants';

export type InputGetWatchedCandlesticksCache = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
};

export type InputSetWatchedCandlesticksCache = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
  candlesticks: CandlestickEntity[];
};

export type InputUpdateWatchedCandlesticksCache = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
  delta: CandlestickEntity[];
};

export type InputDeleteWatchedCandlesticksCache = {
  symbol: CandlestickSymbolType;
  interval: CandlestickIntervalType;
};

type LocalCache = {
  [key: string]: CandlestickEntity[];
};

@Injectable()
export class CandlesticksCacheService {
  private localCache: LocalCache = {};

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getWatched({ symbol, interval }: InputGetWatchedCandlesticksCache) {
    try {
      const key = this.getWatchedKey({ symbol, interval });
      return this.localCache[key] ? this.localCache[key] : false;
      // console.log('get', key);
      // const candlesticks = await this.cacheManager.get(key);

      // return candlesticks
      //   ? (JSON.parse(candlesticks as string) as CandlestickEntity[])
      //   : false;
    } catch (error) {
      throw new InternalServerErrorException('Get watched candlesticks error');
    }
  }

  async setWatched({
    symbol,
    interval,
    candlesticks,
  }: InputSetWatchedCandlesticksCache) {
    try {
      const key = this.getWatchedKey({ symbol, interval });
      // console.log('set', key, candlesticks.length);
      // await this.cacheManager.set(key, JSON.stringify(candlesticks));
      this.localCache[key] = candlesticks;
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Set watched candlesticks error');
    }
  }

  async updateWatched({
    symbol,
    interval,
    delta,
  }: InputUpdateWatchedCandlesticksCache) {
    try {
      // TODO: Think how to get consistency in all caching process and historical cached candlesticks

      let oldCandlesticks = await this.getWatched({ symbol, interval });

      if (!oldCandlesticks) {
        oldCandlesticks = [];
      }

      let newCandlesticks = this.mergeCandlesticks(oldCandlesticks, delta);

      if (newCandlesticks.length > MAX_CACHED_CANDLESTICKS) {
        newCandlesticks = newCandlesticks.slice(
          newCandlesticks.length - MAX_CACHED_CANDLESTICKS,
        );
      }

      return this.setWatched({
        symbol,
        interval,
        candlesticks: newCandlesticks,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Update watched candlesticks error',
      );
    }
  }

  private mergeCandlesticks(
    candlesticks: CandlestickEntity[],
    delta: CandlestickEntity[],
  ) {
    if (candlesticks.length == 0) {
      return delta;
    }

    if (
      delta[delta.length - 1].openTime >
      candlesticks[candlesticks.length - 1].openTime
    ) {
      candlesticks.push(delta[delta.length - 1]);
    } else {
      candlesticks[candlesticks.length - 1] = delta[delta.length - 1];
    }

    return candlesticks;
  }

  async deleteWatched({
    symbol,
    interval,
  }: InputDeleteWatchedCandlesticksCache) {
    try {
      const key = this.getWatchedKey({ symbol, interval });

      delete this.localCache[key];
      // await this.cacheManager.del(key);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Delete watched candlesticks error',
      );
    }
  }

  private getWatchedKey({ symbol, interval }) {
    return `${symbol}-${interval}`;
  }
}
