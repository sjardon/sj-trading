import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateTradingSessionHandler } from './create-trading-session.handler';
import { TradingSessionEntity } from '../../entities/trading-session.entity';
import { StrategiesService } from '../../../strategies/services/strategies.service';
import { CreateTradingSessionCommand } from '../impl/create-trading-session.command';
import { CandlestickIntervalType } from '../../../candlesticks/constants/candlestick-interval.enum.constant';
import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MAX_RUNNING_TRADING_SESSIONS } from '../../constants/trading-session.constants';
import { ENUM_TRADING_SESSION_STATUS } from '../../constants/trading-session-status.enum.constant';

describe('CreateTradingSessionHandler', () => {
  let handler: CreateTradingSessionHandler;
  let repository: Repository<TradingSessionEntity>;
  let strategiesService: StrategiesService;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(TradingSessionEntity);

    const testModule = await Test.createTestingModule({
      providers: [
        CreateTradingSessionHandler,
        {
          provide: StrategiesService,
          useValue: {},
        },
        {
          provide: repositoryToken,
          useValue: {},
        },
      ],
    }).compile();

    handler = testModule.get(CreateTradingSessionHandler);
    strategiesService = testModule.get(StrategiesService);
    repository = testModule.get(repositoryToken);
  });

  describe('Validation', () => {
    it('Throw error if strategy doesnot exist', async () => {
      const strategyId = '39eacc52-a4db-4d97-a575-e564f7e4aeb8';
      strategiesService.findOne = jest.fn().mockReturnValue(null);
      const command = new CreateTradingSessionCommand({
        name: 'some-name',
        strategyId,
        symbol: SymbolType.BTCUSDT,
        interval: CandlestickIntervalType['1h'],
      });

      await expect(handler.execute(command)).rejects.toEqual(
        new BadRequestException(
          `Strategy with id ${strategyId} does not exist`,
        ),
      );
    });

    it('Throw error if it is running a trading session with same symbol-interval', async () => {
      const strategyId = '39eacc52-a4db-4d97-a575-e564f7e4aeb8';
      const symbol = SymbolType.BTCUSDT;
      const interval = CandlestickIntervalType['1h'];
      const command = new CreateTradingSessionCommand({
        name: 'some-name',
        strategyId,
        symbol,
        interval,
      });

      strategiesService.findOne = jest.fn().mockReturnValue({ id: strategyId });
      repository.countBy = jest.fn().mockReturnValueOnce(1).mockReturnValue(0);

      await expect(handler.execute(command)).rejects.toEqual(
        new BadRequestException(
          `There is a trading session running for symbol [${symbol}] - interval [${interval}]`,
        ),
      );
    });

    it('Throw error if max running trading session has reached', async () => {
      const strategyId = '39eacc52-a4db-4d97-a575-e564f7e4aeb8';
      const symbol = SymbolType.BTCUSDT;
      const interval = CandlestickIntervalType['1h'];
      const command = new CreateTradingSessionCommand({
        name: 'some-name',
        strategyId,
        symbol,
        interval,
      });

      strategiesService.findOne = jest.fn().mockReturnValue({ id: strategyId });
      repository.countBy = jest
        .fn()
        .mockReturnValueOnce(0)
        .mockReturnValue(MAX_RUNNING_TRADING_SESSIONS);

      await expect(handler.execute(command)).rejects.toEqual(
        new ServiceUnavailableException('Max running trading sessions reached'),
      );
    });
  });

  describe('Creation', () => {
    //    - If name is empty, set as symbol-interval-startTime (YYYY-MM-DD hh:mm:ss)
    //    - Name must not be repeated. If it's add startTime (YYYY-MM-DD hh:mm:ss)
    let tradingSessionId = 'edc2bbd5-83c1-4c51-b5f9-bf5862abeafa';
    let strategyId: string = '39eacc52-a4db-4d97-a575-e564f7e4aeb8';
    let command: CreateTradingSessionCommand;
    let fakeDate = new Date('2023-05-09T09:10:00.000Z');
    const tradingSessionDto = {
      name: 'some-name',
      strategyId,
      symbol: SymbolType.BTCUSDT,
      interval: CandlestickIntervalType['1h'],
    };

    let createdTradingSession: DeepPartial<TradingSessionEntity> = {
      id: tradingSessionId,
      name: tradingSessionDto.name,
      strategy: {
        id: tradingSessionDto.strategyId,
      },
      symbol: tradingSessionDto.symbol,
      interval: tradingSessionDto.interval,
      startTime: fakeDate.toISOString(),
    };

    beforeEach(() => {
      command = new CreateTradingSessionCommand(tradingSessionDto);

      jest.useFakeTimers();
      jest.setSystemTime(fakeDate);

      strategiesService.findOne = jest
        .fn()
        .mockReturnValue({ id: tradingSessionDto.strategyId });

      repository.countBy = jest.fn().mockReturnValue(0);
      repository.findOneBy = jest.fn().mockReturnValue(null);

      repository.create = jest.fn().mockReturnValueOnce(createdTradingSession);
      repository.save = jest.fn().mockReturnValue(createdTradingSession);
    });

    it('Success tradingSession creation', async () => {
      const expectedCreateTradingSession = {
        name: tradingSessionDto.name,
        strategy: {
          id: tradingSessionDto.strategyId,
        },
        symbol: tradingSessionDto.symbol,
        status: ENUM_TRADING_SESSION_STATUS.CREATED,
        interval: tradingSessionDto.interval,
        startTime: fakeDate.toISOString(),
      };

      jest.spyOn(repository, 'create');
      await handler.execute(command);
      expect(repository.create).toBeCalledWith(expectedCreateTradingSession);
    });

    it('Save name as symbol-interval-startTime if it is empty', async () => {
      const currentCommand = new CreateTradingSessionCommand({
        ...tradingSessionDto,
        name: '',
      });

      const expectedCreateTradingSession = {
        name: `${tradingSessionDto.symbol}-${
          tradingSessionDto.interval
        }-${fakeDate.toISOString()}`,
        strategy: {
          id: tradingSessionDto.strategyId,
        },
        symbol: tradingSessionDto.symbol,
        status: ENUM_TRADING_SESSION_STATUS.CREATED,
        interval: tradingSessionDto.interval,
        startTime: fakeDate.toISOString(),
      };

      jest.spyOn(repository, 'create');
      await handler.execute(currentCommand);
      expect(repository.create).toBeCalledWith(expectedCreateTradingSession);
    });

    it('Save name as usedName-startTime if it already exist', async () => {
      const expectedCreateTradingSession = {
        name: `${tradingSessionDto.name}-${fakeDate.toISOString()}`,
        strategy: {
          id: tradingSessionDto.strategyId,
        },
        symbol: tradingSessionDto.symbol,
        status: ENUM_TRADING_SESSION_STATUS.CREATED,
        interval: tradingSessionDto.interval,
        startTime: fakeDate.toISOString(),
      };

      repository.findOneBy = jest.fn().mockReturnValue(true);

      jest.spyOn(repository, 'create');
      await handler.execute(command);
      expect(repository.create).toBeCalledWith(expectedCreateTradingSession);
    });
  });
});
