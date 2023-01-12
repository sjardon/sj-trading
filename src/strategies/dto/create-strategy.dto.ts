import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateIndicatorExecutorDto } from '../indicators/dto/create-indicator-executor.dto';
import { CreateSignalDto } from '../signals/dto/create-signal.dto';

export class CreateStrategyDto {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSignalDto)
  signals: CreateSignalDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateIndicatorExecutorDto)
  indicators: CreateIndicatorExecutorDto[];
}
