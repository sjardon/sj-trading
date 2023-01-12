import { Column, PrimaryGeneratedColumn } from 'typeorm';

type IndicatorEntityValue = number | string | number[] | string[];

export type InputIndicatorEntity = {
  name: string;
  value?: IndicatorEntityValue;
  children?: IndicatorEntity[];
  parent?: IndicatorEntity;
};

export class IndicatorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @Column('jsonb')
  children?: IndicatorEntity[];

  value?: IndicatorEntityValue;
  // parent?: IndicatorEntity; // For typeorm compability

  constructor(inputIndicatorEntity: InputIndicatorEntity) {
    // super();
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

  getValueByName(name: string): IndicatorEntityValue | false {
    if (this.name == name) {
      return this.value ? this.value : false;
    }

    let searchedIndicator: IndicatorEntityValue | false = false;

    if (Array.isArray(this.children)) {
      for (const indicator of this.children) {
        searchedIndicator = indicator.getValueByName(name);
      }
    }

    if (!searchedIndicator) {
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
}
