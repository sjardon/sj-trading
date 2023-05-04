import { PartialType } from '@nestjs/mapped-types';
import { CreateTradingSessionDto } from './create-trading-session.dto';

export class UpdateTradingSessionDto extends PartialType(CreateTradingSessionDto) {}
