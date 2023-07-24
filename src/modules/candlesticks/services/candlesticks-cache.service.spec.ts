import { Test, TestingModule } from '@nestjs/testing';
import { CandlesticksCacheService } from './candlesticks-cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CandlestickIntervalType,
  SymbolType,
} from '../constants/candlestick-interval.enum.constant';

describe('CandlesticksCacheService', () => {
  let service: CandlesticksCacheService;
  let cacheService: Cache;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        CandlesticksCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    service = testModule.get<CandlesticksCacheService>(
      CandlesticksCacheService,
    );
    cacheService = testModule.get<Cache>(CACHE_MANAGER);

    cacheService.set = jest.fn();
    cacheService.get = jest.fn();
    cacheService.del = jest.fn();
  });

  describe('setWatched', () => {
    it('Key should be {symbol}-{interval}', async () => {
      const symbol = SymbolType.BTCUSDT;
      const interval = CandlestickIntervalType['1h'];

      jest.spyOn(cacheService, 'set');
      await service.setWatched({ symbol, interval, candlesticks: [] });
      expect(cacheService.set).toBeCalledWith(`${symbol}-${interval}`, []);
    });
  });

  describe('Get', () => {
    it('Key should be {symbol}-{interval}', async () => {
      const symbol = SymbolType.BTCUSDT;
      const interval = CandlestickIntervalType['1h'];

      cacheService.get = jest.fn().mockImplementation((key) => {
        return [
          {
            key: `${symbol}-${interval}`,
            value: ['test'],
          },
        ].filter(({ key: elementKey, value }) => key == elementKey);
      });

      expect(service.getWatched({ symbol, interval })).resolves.toBe(['test']);
    });
  });

  describe('Update', () => {
    // TODO: change this to a fake candlestick
    // TODO: Add fake candlesticks generator
    // const symbol = SymbolType.BTCUSDT;
    // const interval = CandlestickIntervalType['1h'];
    // cacheService.get = jest
    //   .fn()
    //   .mockResolvedValueOnce([{ openTime: 1684361983132 }]);
    // expect(
    //   service.updateWatched({
    //     symbol,
    //     interval,
    //     delta: [{ openTime: 1684361983132 }],
    //   }),
    // ).resolves.toBe([1, 2]);
  });

  describe('Delete', () => {});
});
