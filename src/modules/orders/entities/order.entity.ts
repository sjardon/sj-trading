import { Entity } from 'typeorm';
import { OrderEntityAbstract } from './order.entity.abstract';

@Entity('order')
export class OrderEntity extends OrderEntityAbstract {}
