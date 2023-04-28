import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BacktestEntity } from 'src/backtests/entities/backtest.entity';

@Entity('backtestStatistic')
export class BacktestStatisticEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => BacktestEntity)
  @JoinColumn()
  backtest?: BacktestEntity;

  @Column('numeric')
  totalRate: number;

  @Column('numeric')
  profiteableCount: number;

  @Column('numeric')
  unprofiteableCount: number;

  @Column('numeric')
  profiteableAvg: number;

  @Column('numeric')
  unprofiteableAvg: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
