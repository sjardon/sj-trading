import { BacktestTimeframeEntity } from '../../backtests/backtest-timeframe/entities/backtest-timeframe.entity';
import {
  AfterInsert,
  AfterRecover,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

type IndicatorEntityValue =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | boolean[];

export type InputIndicatorEntity = {
  name: string;
  value?: IndicatorEntityValue;
  children?: IndicatorEntity[];
  parent?: IndicatorEntity;
};

@Entity('indicator')
export class IndicatorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @Column('jsonb', {
    nullable: true,
  })
  children?: IndicatorEntity[];

  @Column('varchar')
  value?: IndicatorEntityValue;

  @ManyToOne(() => BacktestTimeframeEntity, { nullable: true, cascade: true })
  backtestTimeframe?: BacktestTimeframeEntity;

  constructor(inputIndicatorEntity: InputIndicatorEntity) {
    super();
    const {
      name,
      value,
      children, // parent
    } = inputIndicatorEntity || {};

    this.name = name;
    this.value = value || '';
    this.children = children;
    // this.parent = parent;
  }

  getValueByName(name: string): IndicatorEntityValue | undefined {
    if (this.name == name) {
      return this.value !== undefined ? this.value : undefined;
    }

    let searchedIndicator: IndicatorEntityValue | undefined = undefined;

    if (Array.isArray(this.children)) {
      for (const indicator of this.children) {
        try {
          searchedIndicator = indicator.getValueByName(name);
          break;
        } catch {
          continue;
        }
      }
    }

    if (searchedIndicator === undefined) {
      throw Error(`Indicator not found: ${name}`);
    }

    return searchedIndicator;
  }

  getIndicatorByName(name: string): IndicatorEntity {
    if (this.name == name) {
      return this;
    }

    let searchedIndicator: IndicatorEntity | false = false;

    if (Array.isArray(this.children)) {
      for (const indicator of this.children) {
        try {
          searchedIndicator = indicator.getIndicatorByName(name);
          break;
        } catch {
          continue;
        }
      }
    }

    if (!searchedIndicator) {
      throw Error(`Indicator not found: ${name}`);
    }

    return searchedIndicator;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async encodeValue() {
    this.value = JSON.stringify(this.value);
  }

  @AfterRecover()
  @AfterInsert()
  @AfterUpdate()
  decodeValue() {
    this.value = JSON.parse(this.value as string);
  }
}
