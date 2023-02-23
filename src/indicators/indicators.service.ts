import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicatorEntity } from './entities/indicator.entity';

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(IndicatorEntity)
    private indicatorsRepository: Repository<IndicatorEntity>,
  ) {}

  async create(indicators: IndicatorEntity[]): Promise<IndicatorEntity[]> {
    try {
      return await this.indicatorsRepository.save(indicators);
    } catch (error) {
      throw error;
    }
  }
}
