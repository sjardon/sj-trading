import { PartialType } from '@nestjs/mapped-types';
import { CreateBacktestOrderDto } from './create-backtest-order.dto';

export class UpdateBacktestOrderDto extends PartialType(CreateBacktestOrderDto) {}
