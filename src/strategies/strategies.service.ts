import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';
import { StrategyEntity } from './entities/strategy.entity';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectRepository(StrategyEntity)
    private strategiesRepository: Repository<StrategyEntity>,
  ) {}

  create(createStrategyDto: CreateStrategyDto) {
    try {
      const strategy = this.strategiesRepository.create(createStrategyDto);
      this.strategiesRepository.save(strategy);
    } catch (thrownError) {
      throw thrownError;
    }

    return createStrategyDto;

    // const signalFactory = new SignalsFactory();
    // const indicatorFactory = new IndicatorsExecutorsFactory();

    // const signals = signalsDto.map((signalDto) =>
    //   signalFactory.create(signalDto),
    // );
    // const indicators = indicatorsDto.map((indicatorDto) =>
    //   indicatorFactory.create(indicatorDto),
    // );

    // return new StrategyEntity(name, signals, indicators);
  }

  findAll() {
    return `This action returns all strategies`;
  }

  async findOne(id: string) {
    try {
      const strategy = await this.strategiesRepository.findOneBy({ id });
      return strategy;
    } catch (thrownError) {
      throw thrownError;
    }
  }

  update(id: number, updateStrategyDto: UpdateStrategyDto) {
    return `This action updates a #${id} strategy`;
  }

  remove(id: number) {
    return `This action removes a #${id} strategy`;
  }
}
