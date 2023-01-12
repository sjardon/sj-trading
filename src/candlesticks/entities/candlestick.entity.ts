import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
export class CandlestickEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  symbol: string;

  @Column()
  open: number;

  @Column()
  close: number;

  @Column()
  high: number;

  @Column()
  low: number;

  @Column()
  openTime: number;

  @Column()
  closeTime: number;

  @Column()
  volume: number;

  constructor(inputCandlestickEntity: InputCandlestickEntity = {}) {
    super();
    const { symbol, open, close, high, low, openTime, closeTime, volume } =
      inputCandlestickEntity;

    this.symbol = symbol || '';
    this.open = +(open || 0);
    this.close = +(close || 0);
    this.high = +(high || 0);
    this.low = +(low || 0);
    this.openTime = openTime || 0;
    this.closeTime = closeTime || 0;
    this.volume = +(volume || 0);
  }

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
}
