import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class GreaterOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [greaterValue, ...lessValues] = this.values;

    const mappedValues = this.values.map((value) => value.resolve());

    const result = !lessValues.find(
      (lessValue) => lessValue.resolve() >= greaterValue.resolve(),
    );

    return result;
  }
}
