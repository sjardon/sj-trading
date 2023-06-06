import { PartialType } from '@nestjs/mapped-types';
import { CreateTradingSessionDto } from './create-trading-session.dto';
import { ENUM_TRADING_SESSION_STATUS } from '../constants/trading-session-status.enum.constant';
import { IsEnum } from 'class-validator';

export class UpdateTradingSessionDto {
  //extends PartialType(CreateTradingSessionDto) {
  @IsEnum(ENUM_TRADING_SESSION_STATUS)
  status: ENUM_TRADING_SESSION_STATUS;
}
