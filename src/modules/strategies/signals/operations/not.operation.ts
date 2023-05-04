import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, boolean>;

export class NotOperation implements OperationInterface<T, boolean> {
  values: T;

  constructor(values: T) {
    this.values = values;
  }

  resolve(): boolean {
    return !this.values.resolve();
  }
}
