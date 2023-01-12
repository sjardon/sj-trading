import { CandlestickIntervalType } from '../../candlesticks/intervals/candlestick-interval.type';
import { CandlestickSymbolType } from '../../candlesticks/symbols/candlestick-symbol.type';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StrategyEntity } from 'src/strategies/entities/strategy.entity';

@Entity('backtest')
export class BacktestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @Column()
  startAmount: number;

  @ManyToOne(() => StrategyEntity)
  strategy: StrategyEntity; // Or strategy: { id }

  @Column()
  symbol: CandlestickSymbolType;

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
