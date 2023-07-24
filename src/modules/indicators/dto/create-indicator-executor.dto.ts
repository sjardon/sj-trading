import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

export enum IndicatorExecutorType {
  SMA = 'SMA',
  EMA = 'EMA',
  SUPPORT_RESISTANCE = 'SUPPORT_RESISTANCE',
  CURRENT_SUPPORT_RESISTANCE = 'CURRENT_SUPPORT_RESISTANCE',
  CONSOLIDATION = 'CONSOLIDATION',
  CANDLESTICK_PATTERNS = 'CANDLESTICK_PATTERNS',
  SWING_CLASSIFICATION = 'SWING_CLASSIFICATION',
  ATR = 'ATR',
  BREAKOUT = 'BREAKOUT',
}

export class CreateIndicatorExecutorConfigurationDto {
  @IsEnum(IndicatorExecutorType)
  type: IndicatorExecutorType;
}

export class CreateIndicatorExecutorDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => CreateIndicatorExecutorConfigurationDto)
  configuration: CreateIndicatorExecutorConfigurationDto;
}
