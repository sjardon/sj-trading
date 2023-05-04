import { Injectable } from '@nestjs/common';
import { CreateTradingSessionDto } from '../dto/create-trading-session.dto';
import { UpdateTradingSessionDto } from '../dto/update-trading-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradingSessionEntity } from '../entities/trading-session.entity';

@Injectable()
export class TradingSessionsService {
  constructor(
    @InjectRepository(TradingSessionEntity)
    private tradingSessionRepository: Repository<TradingSessionEntity>,
  ) {}

  create(createTradingSessionDto: CreateTradingSessionDto) {
    // Validate createTradingSessionDto:
    //    - Strategy exists,
    //    - Name must not be repeated. If it's add random characters.
    //    - If name isn't setted, set as symbol-interval-startTime (YYYY-MM-DD hh:mm:ss)
    //    - Running tradingSession is not above max tradingSession
    //    - symbol-interval is not running now
    console.log(createTradingSessionDto);
    return createTradingSessionDto;
  }

  findAll() {
    return `This action returns all tradingSessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tradingSession`;
  }

  update(id: number, updateTradingSessionDto: UpdateTradingSessionDto) {
    return `This action updates a #${id} tradingSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradingSession`;
  }
}
