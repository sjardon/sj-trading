import { Injectable } from '@nestjs/common';
import { ExchangeClient } from '../adapters/exchange/exchange.client';
import { CandlestickEntity } from './entities/candlestick.entity';
import { InputGetCandlestick } from './candlestick.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { IndicatorEntity } from '../indicators/entities/indicator.entity';
import { IndicatorsService } from '../indicators/indicators.service';

@Injectable()
export class CandlesticksService {
  constructor(
    private exchangeClient: ExchangeClient,

    private indicatorsService: IndicatorsService,
    @InjectRepository(CandlestickEntity)
    private candlesticksRepository: Repository<CandlestickEntity>,
  ) {}

  get = async ({
    symbol,
    interval,
    lookback,
    startTime,
    endTime,
  }: InputGetCandlestick) => {
    // if (lookback > 1000) {
    //   throw new Error('Lookback period is too big');
    // }

    // // TODO: get candlesticks from redis cache

    // try {
    //   const candlesticksQuery: InputGetCandlestick = {
    //     symbol,
    //     interval,
    //     lookback,
    //     startTime,
    //     endTime,
    //   };

    //   const candlesticks = await this.exchangeClient.getCandlesticks(
    //     candlesticksQuery,
    //   );

    //   if (candlesticks.length > 0) {
    //     // await this.saveOnFile(
    //     //   { symbol, interval, startTime, endTime },
    //     //   candlesticks
    //     // );
    //   }

    //   return candlesticks;
    // } catch (thrownError) {
    //   throw thrownError;
    // }
    throw new Error('Method is not implemented');
  };

  futuresGet = async ({
    symbol,
    interval,
    lookback,
    startTime,
    endTime,
  }: InputGetCandlestick) => {
    if (lookback > 1000) {
      throw new Error('Lookback period is too big');
    }

    try {
      // TODO: get candlesticks from cache

      const candlesticks = this.futuresGetAll({
        symbol,
        interval,
        lookback,
        startTime,
        endTime,
      });

      // TODO: save candlesticks on cache

      return candlesticks;
    } catch (thrownError) {
      throw thrownError;
    }
  };

  private async futuresGetAll({
    symbol,
    interval,
    lookback,
    startTime,
    endTime,
  }: InputGetCandlestick) {
    let candles: CandlestickEntity[] = [];
    let isLastCandlesticks = false;

    try {
      while (!isLastCandlesticks) {
        const candlesticksQuery: InputGetCandlestick = {
          symbol,
          interval,
          lookback,
          startTime,
          endTime,
        };

        const newCandlesticks = this.candlesticksRepository.create(
          await this.exchangeClient.futuresGetCandlesticks(candlesticksQuery),
        );

        candles = candles.concat(newCandlesticks);

        startTime = candles[candles.length - 1].closeTime + 60 * 1000;

        isLastCandlesticks = endTime < startTime || newCandlesticks.length == 0;
      }

      return candles;
    } catch (thrownError) {
      throw thrownError;
    }
  }

  async create(
    candlesticks: CandlestickEntity | CandlestickEntity[],
  ): Promise<CandlestickEntity[]> {
    try {
      if (!Array.isArray(candlesticks)) {
        candlesticks = [candlesticks];
      }

      for (let i = 0; i < candlesticks.length; i++) {
        const { symbol, openTime, closeTime } = candlesticks[i];

        let candlestick = await this.candlesticksRepository.findOneBy({
          symbol,
          openTime: openTime / 1000,
          closeTime: closeTime / 1000,
        });

        if (!candlestick) {
          candlestick = await this.candlesticksRepository.create(
            candlesticks[i],
          );

          candlestick = await this.candlesticksRepository.save(candlestick);
        }

        const { indicators } = candlesticks[i];

        candlesticks[i] = this.candlesticksRepository.create({
          ...candlestick,
          indicators,
        });

        if (candlesticks[i].indicators) {
          candlesticks[i].indicators = await this.createIndicators(
            candlesticks[i],
          );
        }
      }

      return candlesticks;
    } catch (error) {
      throw error;
    }
  }

  private async createIndicators(
    candlestick: CandlestickEntity,
  ): Promise<IndicatorEntity[]> {
    let { indicators } = candlestick;

    indicators = indicators.map((indicator) => {
      indicator.candlestick = candlestick;
      return indicator;
    });

    return await this.indicatorsService.create(indicators);
  }

  async retrieve(candlestick: CandlestickEntity) {
    const { symbol, openTime, closeTime } = candlestick;

    return await this.candlesticksRepository.findOne({
      where: {
        symbol,
        openTime,
        closeTime,
      },
    });
  }
}
