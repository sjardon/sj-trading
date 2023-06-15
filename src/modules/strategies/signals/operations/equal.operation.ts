import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number | string>;

export class EqualOperation implements OperationInterface<T[], boolean> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [firstValue, secondValue] = this.values;
    const firstResolvedValue = firstValue.resolve();
    const secondResolvedValue = secondValue.resolve();
    if (firstResolvedValue === secondResolvedValue) {
      return true;
    }

    return false;
    // return !equalValues.find(
    //   (value) => firstValue.resolve() !== value.resolve(),
    // );
  }
}
