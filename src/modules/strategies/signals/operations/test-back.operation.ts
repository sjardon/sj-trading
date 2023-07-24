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

    let initTimes = times.resolve() as unknown as number;
    let i = initTimes;

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

    this.referenceContextVisitor.next(initTimes - (i === -1 ? 0 : i));
    return result;
  }

  setReferenceContextVisitor(referenceContextVisitor: ReferenceContext) {
    this.referenceContextVisitor = referenceContextVisitor;
  }
}
