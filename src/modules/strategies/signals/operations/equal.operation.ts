import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number | string>;

export class EqualOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [firstValue, ...equalValues] = this.values;

    return !equalValues.find(
      (value) => firstValue.resolve() !== value.resolve(),
    );
  }
}
