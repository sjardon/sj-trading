// import { BacktestEntity } from '../backtests/entities/backtest.entity';
import { BacktestEntity } from '../../entities/backtest.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderSide {
  'BUY' = 'BUY',
  'SELL' = 'SELL',
}

export enum OrderPositionSide {
  'BOTH' = 'BOTH',
  'SHORT' = 'SHORT',
  'LONG' = 'LONG',
}

// TODO: extend OrderEntity or BaseOrder
@Entity('backtestOrder')
export class BacktestOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  symbol: string;

  @Column('numeric')
  executedQty: number;

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
