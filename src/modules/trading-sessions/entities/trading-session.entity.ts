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
import { ENUM_TRADING_SESSION_STATUS } from '../constants/trading-session-status.enum.constant';

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
  symbol: SymbolType;

  @Column()
  interval: CandlestickIntervalType;

  @Column({
    type: 'enum',
    enum: ENUM_TRADING_SESSION_STATUS,
    default: ENUM_TRADING_SESSION_STATUS.CREATED,
  })
  status: ENUM_TRADING_SESSION_STATUS;

  @Column('timestamp')
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
