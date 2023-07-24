import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTradingSessionCommand } from '../impl/update-trading-session.command';
import { InjectRepository } from '@nestjs/typeorm';
import { TradingSessionEntity } from '../../entities/trading-session.entity';
import { Repository } from 'typeorm';

@CommandHandler(UpdateTradingSessionCommand)
export class UpdateTradingSessionHandler
  implements ICommandHandler<UpdateTradingSessionCommand>
{
  constructor(
    @InjectRepository(TradingSessionEntity)
    private readonly tradingSessionRepository: Repository<TradingSessionEntity>,
  ) {}

  async execute(command: UpdateTradingSessionCommand) {
    const { id, updateTradingSessionDto } = command;

    const { status } = updateTradingSessionDto;
    try {
      return await this.tradingSessionRepository.save({
        id,
        status,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
