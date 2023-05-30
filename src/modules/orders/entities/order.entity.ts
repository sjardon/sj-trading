import { Column, Entity } from 'typeorm';
import { OrderEntityAbstract } from './order.entity.abstract';

@Entity('order')
export class OrderEntity extends OrderEntityAbstract {
  @Column('exchange_order_id')
  exchangeOrderId: string;

  @Column('exchange_order_status')
  exchangeOrderStatus: string;
}
