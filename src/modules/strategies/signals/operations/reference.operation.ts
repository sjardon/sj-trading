import { InternalServerErrorException } from '@nestjs/common';

import { OperationInterface } from './operation.interface';
import { ReferenceContext } from 'src/common/visitors/reference-contex.visitor';

type T = OperationInterface<unknown, number | boolean | string>;

export class ReferenceOperation implements OperationInterface<string, T> {
  values: string;
  referenceContextVisitor: ReferenceContext;

  constructor(values: string) {
    this.values = values;
  }

  resolve(): T {
    try {
      if (this.referenceContextVisitor) {
        const referencedValue = this.referenceContextVisitor
          .getCurrentReference()
          .getByReferenceOperation(this);

        return referencedValue;
      }

      throw new InternalServerErrorException(
        'ReferenceContextVisitor has not been loaded',
      );
    } catch (thrownError) {
      throw thrownError;
    }
  }

  setReferenceContextVisitor(referenceContextVisitor: ReferenceContext) {
    this.referenceContextVisitor = referenceContextVisitor;
  }
}
