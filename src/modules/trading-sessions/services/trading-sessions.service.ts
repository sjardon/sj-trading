import { Injectable } from '@nestjs/common';
import { CreateTradingSessionDto } from '../dto/create-trading-session.dto';
import { UpdateTradingSessionDto } from '../dto/update-trading-session.dto';

@Injectable()
export class TradingSessionsService {
  create(createTradingSessionDto: CreateTradingSessionDto) {
    return 'This action adds a new tradingSession';
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
