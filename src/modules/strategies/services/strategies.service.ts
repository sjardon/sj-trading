import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStrategyDto } from '../dto/create-strategy.dto';
import { UpdateStrategyDto } from '../dto/update-strategy.dto';
import { StrategyEntity } from '../entities/strategy.entity';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectRepository(StrategyEntity)
    private strategiesRepository: Repository<StrategyEntity>,
  ) {}

  async create(createStrategyDto: CreateStrategyDto) {
    try {
      const strategy = this.strategiesRepository.create(createStrategyDto);
      await this.strategiesRepository.save(strategy);

      return strategy;
    } catch (thrownError) {
      throw thrownError;
    }
  }

  findAll() {
    return `This action returns all strategies`;
  }

  async findOne(id: string) {
    try {
      const strategy = await this.strategiesRepository.findOneBy({ id });
      return strategy ? strategy : false;
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
