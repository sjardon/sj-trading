import { CandlestickIntervalType } from '../../candlesticks/constants/candlestick-interval.enum.constant';
import { SymbolType } from '../../../common/helpers/services/symbols/constants/symbol.enum.constant';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StrategyEntity } from '../../strategies/entities/strategy.entity';

@Entity('backtest')
export class BacktestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @ManyToOne(() => StrategyEntity)
  strategy: StrategyEntity; // Or strategy: { id }

  @Column()
  symbol: SymbolType;

  @Column()
  interval: CandlestickIntervalType;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
