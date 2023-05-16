import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTradingSessionCommand } from '../impl/create-trading-session.command';
import { InjectRepository } from '@nestjs/typeorm';
import { TradingSessionEntity } from '../../entities/trading-session.entity';
import { Repository, In } from 'typeorm';
import { StrategiesService } from '../../../strategies/services/strategies.service';
import { CreateTradingSessionDto } from '../../dto/create-trading-session.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MAX_RUNNING_TRADING_SESSIONS } from '../../constants/trading-session.constants';
import { ENUM_TRADING_SESSION_STATUS } from '../../constants/trading-session-status.enum.constant';
import {
  CandlestickIntervalType,
  CandlestickSymbolType,
} from '../../../candlesticks/intervals/candlestick-interval.type';

@CommandHandler(CreateTradingSessionCommand)
export class CreateTradingSessionHandler
  implements ICommandHandler<CreateTradingSessionCommand>
{
  constructor(
    private readonly strategiesService: StrategiesService,
    @InjectRepository(TradingSessionEntity)
    private readonly tradingSessionRepository: Repository<TradingSessionEntity>,
  ) {}

  async execute(command: CreateTradingSessionCommand) {
    // Validate
    // Create new entity

    const { createTradingSessionDto } = command;
    await this.validate(createTradingSessionDto);
    return await this.create(createTradingSessionDto);
  }

  private async validate(createTradingSessionDto: CreateTradingSessionDto) {
    let { strategyId, symbol, interval } = createTradingSessionDto;

    const isValidStrategy = await this.validateStrategy(strategyId);

    if (!isValidStrategy) {
      throw new BadRequestException(
        `Strategy with id ${strategyId} does not exist`,
      );
    }

    const validSingleTradingSession = await this.validateSingleTradingSessions(
      symbol,
      interval,
    );

    if (!validSingleTradingSession) {
      throw new BadRequestException(
        `There is a trading session running for symbol [${symbol}] - interval [${interval}]`,
      );
    }

    const validMaxRunningTradingSessions =
      await this.validateMaxRunningTradingSessions();

    if (!validMaxRunningTradingSessions) {
      throw new ServiceUnavailableException(
        'Max running trading sessions reached',
      );
    }
  }

  async validateSingleTradingSessions(
    symbol: CandlestickSymbolType,
    interval: CandlestickIntervalType,
  ) {
    try {
      const count = await this.tradingSessionRepository.countBy({
        symbol,
        interval,
        status: In([
          ENUM_TRADING_SESSION_STATUS.TO_START,
          ENUM_TRADING_SESSION_STATUS.STARTING,
          ENUM_TRADING_SESSION_STATUS.IN_PROGRESS,
        ]),
      });

      if (count >= 1) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
  async validateMaxRunningTradingSessions() {
    try {
      const count = await this.tradingSessionRepository.countBy({
        status: In([
          ENUM_TRADING_SESSION_STATUS.TO_START,
          ENUM_TRADING_SESSION_STATUS.STARTING,
          ENUM_TRADING_SESSION_STATUS.IN_PROGRESS,
        ]),
      });

      if (count >= MAX_RUNNING_TRADING_SESSIONS) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async validateStrategy(strategyId: string): Promise<boolean> {
    try {
      const strategy = await this.strategiesService.findOne(strategyId);
      if (strategy) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async create(createTradingSessionDto: CreateTradingSessionDto) {
    //    - If name is empty, set as symbol-interval-startTime (YYYY-MM-DD hh:mm:ss)
    //    - Name must not be repeated. If it's add startTime (YYYY-MM-DD hh:mm:ss)

    let { name, strategyId, symbol, interval } = createTradingSessionDto;

    const startTime = new Date().toISOString();

    name = await this.getValidName({
      name,
      symbol,
      interval,
      startTime,
    });

    try {
      let tradingSession = this.tradingSessionRepository.create({
        name,
        strategy: { id: strategyId },
        symbol,
        status: ENUM_TRADING_SESSION_STATUS.CREATED,
        interval,
        startTime,
      });

      tradingSession = await this.tradingSessionRepository.save(tradingSession);

      return tradingSession;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Internal error: Trading session not created',
      );
    }
  }

  private async getValidName({ name, symbol, interval, startTime }) {
    if (!name || name == '') {
      name = `${symbol}-${interval}-${startTime}`;
    } else {
      const nameExists = await this.nameExists(name);
      if (!nameExists) {
        name = `${name}-${startTime}`;
      }
    }
    return name;
  }

  async nameExists(name: string): Promise<boolean> {
    try {
      const tradingSession = await this.tradingSessionRepository.findOneBy({
        name,
      });

      return tradingSession ? false : true;
    } catch (error) {
      return true;
    }
  }
}
