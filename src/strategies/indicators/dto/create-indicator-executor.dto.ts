import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

export enum IndicatorExecutorType {
  SMA = 'SMA',
  EMA = 'EMA',
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
