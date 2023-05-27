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

import { TradingSessionEntity } from 'src/modules/trading-sessions/entities/trading-session.entity';
import { OperationAbstract } from './operation.entity.abstract';

@Entity('backtestOperation')
export class OperationEntity extends OperationAbstract {
  @ManyToOne(() => TradingSessionEntity)
  tradingSession: TradingSessionEntity;

  // @OneToOne(() => BacktestOrderEntity)
  // @JoinColumn()
  // openOrder?: BacktestOrderEntity;

  // @OneToOne(() => BacktestOrderEntity)
  // @JoinColumn()
  // closeOrder?: BacktestOrderEntity;

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
