import { BacktestEntity } from '../../entities/backtest.entity';
import { CandlestickEntity } from '../../../candlesticks/entities/candlestick.entity';
import { IndicatorEntity } from '../../../indicators/entities/indicator.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('backtestTimeframe')
export class BacktestTimeframeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => BacktestEntity, { cascade: true })
  backtest?: BacktestEntity;

  @ManyToOne(() => CandlestickEntity, {
    cascade: true,
  })
  @JoinColumn()
  candlestick: CandlestickEntity;

  @OneToMany(
    () => IndicatorEntity,
    (indicator) => indicator.backtestTimeframe,
    { cascade: ['insert', 'update'] },
  )
  indicators?: IndicatorEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
