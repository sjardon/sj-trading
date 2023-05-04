import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, boolean>;

export class AndOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    for (const value of this.values) {
      if (!value.resolve()) {
        return false;
      }
    }

    return true;
  }
}
