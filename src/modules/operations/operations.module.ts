import { Module } from '@nestjs/common';
import { OperationsService } from './services/operations.service';
import { OrdersModule } from '../orders/orders.module';
import { OperationEntity } from './entities/operation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [OperationsService],
  exports: [OperationsService],
  imports: [TypeOrmModule.forFeature([OperationEntity]), OrdersModule],
})
export class OperationsModule {}
