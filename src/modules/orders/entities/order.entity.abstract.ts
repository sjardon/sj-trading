import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntityInterface } from './order.entity.interface';
import {
  OrderPositionSide,
  OrderSide,
} from '../constants/orders.enum.constant';

export abstract class OrderEntityAbstract
  extends BaseEntity
  implements OrderEntityInterface
{
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  symbol: string;

  @Column('numeric')
  amount: number;

  @Column()
  type: string;

  @Column()
  side?: OrderSide;

  @Column()
  positionSide?: OrderPositionSide;

  @Column()
  transactTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  isShort(): boolean {
    if (this.positionSide == 'SHORT') {
      return true;
    }

    return false;
  }

  isLong(): boolean {
    if (this.positionSide == 'LONG') {
      return true;
    }

    return false;
  }
}
