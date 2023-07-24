import { UpdateTradingSessionDto } from '../../dto/update-trading-session.dto';

export class UpdateTradingSessionCommand {
  constructor(
    public id: string,
    public updateTradingSessionDto: UpdateTradingSessionDto,
  ) {}
}
