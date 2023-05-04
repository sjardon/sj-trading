import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class LessOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [lessValue, ...greaterValues] = this.values;

    return !greaterValues.find(
      (greaterValue) => lessValue.resolve() >= greaterValue.resolve(),
    );
  }
}
