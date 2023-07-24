import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { TradingSessionEntity } from '../../trading-sessions/entities/trading-session.entity';
import { OperationEntityAbstract } from './operation.entity.abstract';
import { OrderEntity } from '../../orders/entities/order.entity';

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
