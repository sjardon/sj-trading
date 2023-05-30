import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './services/orders.service';
import { OrderEntity } from './entities/order.entity';
import { AdaptersModule } from '../adapters/adapters.module';

@Module({
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([OrderEntity]), AdaptersModule],
  exports: [OrdersService],
})
export class OrdersModule {}
