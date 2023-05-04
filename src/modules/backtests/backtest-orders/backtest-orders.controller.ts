import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BacktestOrdersService } from './backtest-orders.service';
import { CreateBacktestOrderDto } from './dto/create-backtest-order.dto';
import { UpdateBacktestOrderDto } from './dto/update-backtest-order.dto';

@Controller('backtest-orders')
export class BacktestOrdersController {
  constructor(private readonly backtestOrdersService: BacktestOrdersService) {}

  // @Post()
  // create(@Body() createBacktestOrderDto: CreateBacktestOrderDto) {
  //   return this.backtestOrdersService.create(createBacktestOrderDto);
  // }

  // @Get()
  // findAll() {
  //   return this.backtestOrdersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.backtestOrdersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBacktestOrderDto: UpdateBacktestOrderDto) {
  //   return this.backtestOrdersService.update(+id, updateBacktestOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.backtestOrdersService.remove(+id);
  // }
}
