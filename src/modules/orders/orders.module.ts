import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './services/orders.service';
import { OrderEntity } from './entities/order.entity';

@Module({
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  exports: [OrdersService],
})
export class OrdersModule {}
