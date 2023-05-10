import { Injectable } from '@nestjs/common';
import { CreateTradingSessionDto } from '../dto/create-trading-session.dto';
import { UpdateTradingSessionDto } from '../dto/update-trading-session.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTradingSessionCommand } from '../commands/impl/create-trading-session.command';

@Injectable()
export class TradingSessionsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(createTradingSessionDto: CreateTradingSessionDto) {
    return this.commandBus.execute(
      new CreateTradingSessionCommand(createTradingSessionDto),
    );

    // raise a start- event
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
