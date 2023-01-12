import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number>;

export class MultiplicationOperation
  implements OperationInterface<T[], number>
{
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): number {
    return this.values.reduce((accumulator, currentValue) => {
      return accumulator * currentValue.resolve();
    }, 1);
  }
}
