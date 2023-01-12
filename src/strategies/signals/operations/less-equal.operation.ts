import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class LessEqualOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [lessValue, ...greaterValues] = this.values;

    const result = !greaterValues.find(
      (greaterValue) => lessValue.resolve() > greaterValue.resolve(),
    );

    return result;
  }
}
