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
import { StrategyEntity } from '../../strategies/entities/strategy.entity';

@Entity('tradingSession')
export class TradingSessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Now: user, account and risk management are default values.

  // TODO: set custom user, account and risk management

  @Column()
  name: string;

  @ManyToOne(() => StrategyEntity)
  strategy: StrategyEntity;

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
