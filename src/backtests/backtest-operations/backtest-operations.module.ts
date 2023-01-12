import { Module } from '@nestjs/common';
import { BacktestOperationsService } from './backtest-operations.service';
import { BacktestOperationsController } from './backtest-operations.controller';
import { BacktestOrdersModule } from '../backtest-orders/backtest-orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BacktestOperationEntity } from './entities/backtest-operation.entity';

@Module({
  controllers: [BacktestOperationsController],
  providers: [BacktestOperationsService],
  imports: [
    BacktestOrdersModule,
    TypeOrmModule.forFeature([BacktestOperationEntity]),
  ],
  exports: [BacktestOperationsService],
})
export class BacktestOperationsModule {}
