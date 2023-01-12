import { Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BacktestsService } from './backtests.service';
import { CreateBacktestDto } from './dto/create-backtest.dto';

@Controller('backtests')
export class BacktestsController {
  constructor(private backtestsService: BacktestsService) {}
  @Post()
  create(@Body() createBacktestDto: CreateBacktestDto): any {
    // TODO: Create a pipe instead
    createBacktestDto = plainToInstance(CreateBacktestDto, createBacktestDto);
    return this.backtestsService.create(createBacktestDto);
  }
}
