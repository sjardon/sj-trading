import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TickTradingSessionCommand } from '../impl/tick-trading-session.command';
import { Logger } from '@nestjs/common';

@CommandHandler(TickTradingSessionCommand)
export class TickTradingSessionHandler
  implements ICommandHandler<TickTradingSessionCommand>
{
  private readonly logger = new Logger(TickTradingSessionHandler.name);

  constructor() {}

  async execute(command: TickTradingSessionCommand) {
    const { candlesticks } = command;

    this.logger.log(
      `${candlesticks.length} - ${JSON.stringify(
        candlesticks[candlesticks.length - 1],
      )}`,
    );
  }
}
