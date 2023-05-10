import { CreateTradingSessionDto } from '../../dto/create-trading-session.dto';

export class CreateTradingSessionCommand {
  constructor(public createTradingSessionDto: CreateTradingSessionDto) {}
}
