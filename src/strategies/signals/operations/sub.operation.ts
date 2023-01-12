import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class SubOperation implements OperationInterface<T[], number> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): number {
    return this.values.reduce((accumulator, currentValue) => {
      return currentValue.resolve() - accumulator;
    }, 0);
  }
}
