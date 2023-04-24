import { Injectable } from '@nestjs/common';
import { BacktestTimeframeEntity } from './entities/backtest-timeframe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBacktestTimeframeDto } from './dto/create-backtest-timeframe.dto';
import { CandlesticksService } from 'src/candlesticks/candlesticks.service';

@Injectable()
export class BacktestTimeframesService {
  constructor(
    private candlesticksService: CandlesticksService,
    @InjectRepository(BacktestTimeframeEntity)
    private backtestTimeframesRepository: Repository<BacktestTimeframeEntity>,
  ) {}

  public async create(
    createBacktestTimeframeDto: CreateBacktestTimeframeDto,
  ): Promise<BacktestTimeframeEntity> {
    const { candlestick } = createBacktestTimeframeDto;

    if (candlestick) {
      const [newCandlestick] = await this.candlesticksService.create(
        candlestick,
      );

      createBacktestTimeframeDto.candlestick = newCandlestick;
    }

    const backtestTimeframe = this.backtestTimeframesRepository.create(
      createBacktestTimeframeDto,
    );

    return await this.backtestTimeframesRepository.save(backtestTimeframe);
  }

  public async getAllByBacktest(backtestId: string) {
    return await this.backtestTimeframesRepository.find({
      relations: {
        candlestick: true,
        indicators: true,
      },
      where: { backtest: { id: backtestId } },
      order: {
        candlestick: { closeTime: 'ASC' },
      },
    });
  }
}
