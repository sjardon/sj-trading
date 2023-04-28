import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class SubOperation implements OperationInterface<T[], number> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): number {
    const [val1, val2] = this.values;
    const result = val1.resolve() - val2.resolve();
    return result;
  }
}
