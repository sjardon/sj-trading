import { BacktestEntity } from '../../entities/backtest.entity';
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
import { BacktestOrderEntity } from '../../backtest-orders/entities/backtest-order.entity';
import { OperationEntityAbstract } from 'src/modules/operations/entities/operation.entity.abstract';

@Entity('backtestOperation')
export class BacktestOperationEntity extends OperationEntityAbstract {
  @ManyToOne(() => BacktestEntity)
  backtest: BacktestEntity;

  @OneToOne(() => BacktestOrderEntity)
  @JoinColumn()
  openOrder?: BacktestOrderEntity;

  @OneToOne(() => BacktestOrderEntity)
  @JoinColumn()
  closeOrder?: BacktestOrderEntity;
}
