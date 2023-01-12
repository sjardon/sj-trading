import { Module } from '@nestjs/common';
import { BacktestOrdersService } from './backtest-orders.service';
import { BacktestOrdersController } from './backtest-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestOrderEntity } from './entities/backtest-order.entity';

@Module({
  controllers: [BacktestOrdersController],
  providers: [BacktestOrdersService],
  imports: [TypeOrmModule.forFeature([BacktestOrderEntity])],
  exports: [BacktestOrdersService],
})
export class BacktestOrdersModule {}
