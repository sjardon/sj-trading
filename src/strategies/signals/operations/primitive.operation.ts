import { OperationInterface } from './operation.interface';

export class PrimitiveOperation
  implements
    OperationInterface<boolean | number | string, boolean | number | string>
{
  values: boolean | number | string;

  constructor(values: boolean | number | string) {
    this.values = values;
  }

  resolve(): boolean | number | string {
    return this.values;
  }
}
