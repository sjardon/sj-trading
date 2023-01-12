import { BacktestEntity } from 'src/backtests/entities/backtest.entity';
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

@Entity('backtestOperation')
export class BacktestOperationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => BacktestEntity)
  backtest: BacktestEntity;

  @OneToOne(() => BacktestOrderEntity)
  @JoinColumn()
  openOrder?: BacktestOrderEntity;

  @OneToOne(() => BacktestOrderEntity)
  @JoinColumn()
  closeOrder?: BacktestOrderEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  isOpen(): boolean {
    if (!this.closeOrder && this.openOrder) {
      return true;
    }

    return false;
  }

  isClose(): boolean {
    if (this.closeOrder) {
      return true;
    }

    return false;
  }

  isBoth(): boolean {
    return this.openOrder?.positionSide == 'BOTH' ? true : false;
  }

  isLong(): boolean {
    return this.openOrder?.positionSide == 'LONG' ? true : false;
  }

  isShort(): boolean {
    return this.openOrder?.positionSide == 'SHORT' ? true : false;
  }
}
