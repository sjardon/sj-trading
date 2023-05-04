import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class AddOperation implements OperationInterface<T[], number> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): number {
    const result = this.values.reduce((accumulator, currentValue) => {
      return accumulator + +currentValue.resolve();
    }, 0);
    return result;
  }
}
