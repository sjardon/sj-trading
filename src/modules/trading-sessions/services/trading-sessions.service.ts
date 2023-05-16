import { Injectable } from '@nestjs/common';
import { CreateTradingSessionDto } from '../dto/create-trading-session.dto';
import { UpdateTradingSessionDto } from '../dto/update-trading-session.dto';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { CreateTradingSessionCommand } from '../commands/impl/create-trading-session.command';
import { StartTradingSessionEvent } from '../events/impl/start-trading-session.event';

@Injectable()
export class TradingSessionsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(createTradingSessionDto: CreateTradingSessionDto) {
    const createdTradingSession = await this.commandBus.execute(
      new CreateTradingSessionCommand(createTradingSessionDto),
    );
    if (createdTradingSession) {
      const { id } = createdTradingSession;
      this.eventBus.publish(new StartTradingSessionEvent(id));
    }

    return createdTradingSession;
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
