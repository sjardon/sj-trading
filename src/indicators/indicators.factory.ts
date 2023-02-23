import { BadRequestException } from '@nestjs/common';
import { CreateIndicatorExecutorDto } from './dto/create-indicator-executor.dto';
import { IndicatorExecutorInterface } from './indicators-set/indicator-executor.interface';
import { SmaExecutor } from './indicators-set/sma/sma.executor';

export class IndicatorsExecutorsFactory {
  private indicatorExecutorsMap = {
    SMA: (name, configuration): IndicatorExecutorInterface =>
      new SmaExecutor(name, configuration),
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
