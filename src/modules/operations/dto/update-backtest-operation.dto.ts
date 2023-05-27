import { PartialType } from '@nestjs/mapped-types';
import { CreateBacktestOperationDto } from './create-backtest-operation.dto';

export class UpdateBacktestOperationDto extends PartialType(CreateBacktestOperationDto) {}
