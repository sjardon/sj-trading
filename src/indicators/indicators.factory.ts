import { BadRequestException } from '@nestjs/common';
import { CreateIndicatorExecutorDto } from './dto/create-indicator-executor.dto';
import { IndicatorExecutorInterface } from './indicators-set/indicator-executor.interface';
import { SmaExecutor } from './indicators-set/sma/sma.executor';
import { SupportResistanceExecutor } from './indicators-set/support-resistance/support-resistance.executor';
import { CurrentSupportResistanceExecutor } from './indicators-set/current-support-resistance/current-support-resistance.executor';
import { CandlestickPatternsExecutor } from './indicators-set/candlestick-patterns/candlestick-patterns.indicator';
import { ConsolidationExecutor } from './indicators-set/consolidation/consolidation.executor';
import { SwingClassificationExecutor } from './indicators-set/swing-classification/swing-classification.indicator';
import { AtrExecutor } from './indicators-set/atr/atr.executor';

export class IndicatorsExecutorsFactory {
  private indicatorExecutorsMap = {
    SMA: (name, configuration): IndicatorExecutorInterface =>
      new SmaExecutor(name, configuration),
    SUPPORT_RESISTANCE: (name, configuration): IndicatorExecutorInterface =>
      new SupportResistanceExecutor(name, configuration),

    CURRENT_SUPPORT_RESISTANCE: (
      name,
      configuration,
    ): IndicatorExecutorInterface =>
      new CurrentSupportResistanceExecutor(name, configuration),

    CONSOLIDATION: (name, configuration): IndicatorExecutorInterface =>
      new ConsolidationExecutor(name, configuration),

    CANDLESTICK_PATTERNS: (name, configuration): IndicatorExecutorInterface =>
      new CandlestickPatternsExecutor(name, configuration),

    SWING_CLASSIFICATION: (name, configuration): IndicatorExecutorInterface =>
      new SwingClassificationExecutor(name, configuration),

    ATR: (name, configuration): IndicatorExecutorInterface =>
      new AtrExecutor(name, configuration),
  };

  create(
    createIndicatorExecutorsDto: CreateIndicatorExecutorDto[],
  ): IndicatorExecutorInterface[] {
    return createIndicatorExecutorsDto.map((createIndicatorExecutorDto) =>
      this.createOne(createIndicatorExecutorDto),
    );
  }

  createOne(
    createIndicatorExecutorDto: CreateIndicatorExecutorDto,
  ): IndicatorExecutorInterface {
    const { name, configuration } = createIndicatorExecutorDto;
    if (!this.indicatorExecutorsMap[configuration.type]) {
      throw new BadRequestException('Indicator type does not exist');
    }

    return this.indicatorExecutorsMap[configuration.type](name, configuration);
  }
}
