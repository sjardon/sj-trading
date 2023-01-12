import { InternalServerErrorException } from '@nestjs/common';
import { ReferenceVisitor } from 'src/utils/visitors/reference.visitor';
import { OperationInterface } from './operation.interface';

type T = OperationInterface<unknown, number | boolean | string>;

export class ReferenceOperation implements OperationInterface<string, T> {
  values: string;
  referenceVisitor: ReferenceVisitor;

  constructor(values: string) {
    this.values = values;
  }

  resolve(): T {
    try {
      if (this.referenceVisitor) {
        return this.referenceVisitor.getByReferenceOperation(this);
      }

      throw new InternalServerErrorException(
        'ReferenceVisitor has not been loaded',
      );
    } catch (thrownError) {
      throw thrownError;
    }
  }

  setReferenceVisitor(referenceVisitor: ReferenceVisitor) {
    this.referenceVisitor = referenceVisitor;
  }
}
