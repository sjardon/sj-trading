import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BacktestCandlestickView } from '../entities/backtest-candlestick.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BacktestCandlestickService {
  constructor(
    @InjectRepository(BacktestCandlestickView)
    private backtestCandlestickRepository: Repository<BacktestCandlestickView>,
  ) {}

  async getByBacktestId(backtestId) {
    try {
      return await this.backtestCandlestickRepository.find({
        where: { backtestId },
        order: { closeTime: 'ASC' },
      });
    } catch (error) {
      throw error;
    }
  }
}
