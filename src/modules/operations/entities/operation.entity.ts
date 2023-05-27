import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TradingSessionEntity } from 'src/modules/trading-sessions/entities/trading-session.entity';
import { OperationEntityAbstract } from './operation.entity.abstract';
import { OrderEntity } from 'src/modules/orders/entities/order.entity';

@Entity('operation')
export class OperationEntity extends OperationEntityAbstract {
  @ManyToOne(() => TradingSessionEntity)
  tradingSession: TradingSessionEntity;

  @OneToOne(() => OrderEntity)
  @JoinColumn()
  openOrder?: OrderEntity;

  @OneToOne(() => OrderEntity)
  @JoinColumn()
  closeOrder?: OrderEntity;
}
