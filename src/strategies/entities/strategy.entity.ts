// import { IndicatorEntity } from '../indicators/entities/indicator.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CreateIndicatorExecutorConfigurationDto,
  CreateIndicatorExecutorDto,
} from '../indicators/dto/create-indicator-executor.dto';
import { IndicatorExecutorInterface } from '../indicators/indicators-set/indicator-executor.interface';
import { CreateSignalDto } from '../signals/dto/create-signal.dto';
import { SignalEntity } from '../signals/entities/signal.entity';

type InputStrategyEntity = {
  name: string;
  signals: CreateSignalDto[];
  // signals: SignalEntity[],
  indicators: CreateIndicatorExecutorDto[];
  // indicators: IndicatorExecutorInterface[],
};

@Entity('strategy')
export class StrategyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @Column('jsonb')
  signals: CreateSignalDto[];
  // signals: SignalEntity[];

  @Column('jsonb')
  indicators: CreateIndicatorExecutorDto[];
  // indicators: IndicatorExecutorInterface[];

  @Column('numeric')
  takeProfit: number;

  @Column('numeric')
  stopLoss: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
