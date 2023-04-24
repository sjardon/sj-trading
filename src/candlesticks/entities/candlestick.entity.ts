import { IndicatorEntity } from 'src/indicators/entities/indicator.entity';
import {
  AfterInsert,
  AfterRecover,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  BeforeRecover,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type InputCandlestickEntity = {
  symbol?: string;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  openTime?: number;
  closeTime?: number;
  volume?: number;
};

@Entity('candlestick')
@Index(['symbol', 'openTime', 'closeTime'], { unique: true })
export class CandlestickEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  symbol: string;

  @Column('numeric')
  open: number;

  @Column('numeric')
  close: number;

  @Column('numeric')
  high: number;

  @Column('numeric')
  low: number;

  @Column()
  openTime: number;

  @Column()
  closeTime: number;

  @Column('numeric')
  volume: number;

  //TODO: Add enum
  @Column()
  interval: string;

  change = () => {
    return Math.abs(this.close - this.open);
  };

  range = () => {
    return this.high - this.low;
  };

  isBearish = () => {
    if (this.open > this.close) {
      return true;
    }

    return false;
  };

  isBullish = () => {
    if (this.open <= this.close) {
      return true;
    }

    return false;
  };

  @BeforeInsert()
  @BeforeUpdate()
  timeToSeconds() {
    this.openTime = +this.openTime / 1000;
    this.closeTime = +this.closeTime / 1000;
  }

  @AfterRecover()
  @AfterInsert()
  @AfterUpdate()
  timeToMilliseconds() {
    this.openTime = +this.openTime * 1000;
    this.closeTime = +this.closeTime * 1000;
  }
}
