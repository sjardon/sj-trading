import { ReferenceContext } from '../../../../common/visitors/reference-contex.visitor';
import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, boolean>;

export class TestBackOperation implements OperationInterface<T[], boolean> {
  values: T[];
  referenceContextVisitor: ReferenceContext;

  constructor(values: T[]) {
    this.values = values;
  }

  resolve(): boolean {
    const [times, ...currentValues] = this.values;

    let i = times.resolve() as unknown as number;
    let result: boolean = false;
    while (i >= 0) {
      for (const value of currentValues) {
        if (value.resolve()) {
          result = true;
          break;
        }
      }

      this.referenceContextVisitor.back();
      i--;
    }

    this.referenceContextVisitor.reset();
    return result;
  }

  setReferenceContextVisitor(referenceContextVisitor: ReferenceContext) {
    this.referenceContextVisitor = referenceContextVisitor;
  }
}
