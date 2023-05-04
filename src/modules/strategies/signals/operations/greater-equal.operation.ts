import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class GreaterEqualOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [greaterValue, ...lessValues] = this.values;

    const result = !lessValues.find(
      (lessValue) => lessValue.resolve() > greaterValue.resolve(),
    );

    return result;
  }
}
