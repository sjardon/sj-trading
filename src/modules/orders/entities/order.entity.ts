import { Column, Entity } from 'typeorm';
import { OrderEntityAbstract } from './order.entity.abstract';

@Entity('order')
export class OrderEntity extends OrderEntityAbstract {
  @Column({ name: 'exchange_order_id' })
  exchangeOrderId: string;

  @Column({ name: 'exchange_order_status' })
  exchangeOrderStatus: string;
}
