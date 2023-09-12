import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BacktestsService } from '../services/backtests.service';
import { CreateBacktestDto } from '../dto/create-backtest.dto';

@Controller('backtests')
export class BacktestsController {
  constructor(private backtestsService: BacktestsService) {}
  @Post()
  async create(@Body() createBacktestDto: CreateBacktestDto): Promise<any> {
    // TODO: Create a pipe instead
    createBacktestDto = plainToInstance(CreateBacktestDto, createBacktestDto);
    // const {
    //   id,
    //   name,
    //   strategy,
    //   symbol,
    //   interval,
    //   startTime,
    //   endTime,
    //   createdAt,
    //   updatedAt,
    // } = await this.backtestsService.create(createBacktestDto);

    // return {
    //   id,
    //   name,
    //   symbol,
    //   interval,
    //   startTime,
    //   endTime,
    //   strategy: { id: strategy.id },
    //   createdAt,
    //   updatedAt,
    // };
    return new ForbiddenException();
  }
}
