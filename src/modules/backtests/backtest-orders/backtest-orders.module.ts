import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestOrdersService } from './backtest-orders.service';
import { BacktestOrdersController } from './backtest-orders.controller';
import { BacktestOrderEntity } from './entities/backtest-order.entity';

@Module({
  controllers: [BacktestOrdersController],
  providers: [BacktestOrdersService],
  imports: [TypeOrmModule.forFeature([BacktestOrderEntity])],
  exports: [BacktestOrdersService],
})
export class BacktestOrdersModule {}
