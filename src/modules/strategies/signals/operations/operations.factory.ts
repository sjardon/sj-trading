import { BadRequestException } from '@nestjs/common';
import {
  CreateOperationDto,
  CreateOperationType,
} from './dto/create-operation.dto';
import { AndOperation } from './and.operation';
import { EqualOperation } from './equal.operation';
import { GreaterEqualOperation } from './greater-equal.operation';
import { GreaterOperation } from './greater.operation';
import { LessEqualOperation } from './less-equal.operation';
import { LessOperation } from './less.operation';
import { NotOperation } from './not.operation';
import { OrOperation } from './or.operation';
import { AddOperation } from './add.operation';
import { DivisionOperation } from './division.operation';
import { MultiplicationOperation } from './multiplication.operation';
import { SubOperation } from './sub.operation';
import { OperationInterface } from './operation.interface';
import { PrimitiveOperation } from './primitive.operation';
import { plainToInstance } from 'class-transformer';
import { ReferenceOperation } from './reference.operation';
import { ReferenceContext } from 'src/common/visitors/reference-contex.visitor';
import { TestBackOperation } from './test-back.operation';

export class OperationsFactory {
  private operationsMap = {
    AND: (operation) => new AndOperation(operation.values),
    OR: (operation) => new OrOperation(operation.values),
    NOT: (operation) => new NotOperation(operation.values),
    GT: (operation) => new GreaterOperation(operation.values),
    GT_EQ: (operation) => new GreaterEqualOperation(operation.values),
    LT: (operation) => new LessOperation(operation.values),
    LT_EQ: (operation) => new LessEqualOperation(operation.values),
    EQ: (operation) => new EqualOperation(operation.values),
    ADD: (operation) => new AddOperation(operation.values),
    SUB: (operation) => new SubOperation(operation.values),
    DIV: (operation) => new DivisionOperation(operation.values),
    MLP: (operation) => new MultiplicationOperation(operation.values),
    REF: (operation) => new ReferenceOperation(operation.values),
    PRIM: (operation) => new PrimitiveOperation(operation.values),
    TEST_BACK: (operation) => new TestBackOperation(operation.values),
  };

  // create(createOperationDto: CreateOperationDto): OperationInterface {
  create(
    createOperationDto: boolean | string | number | CreateOperationDto,
    referenceContextVisitor: ReferenceContext,
  ): OperationInterface<unknown, unknown> {
    if (this.isPrimitive(createOperationDto)) {
      const type: CreateOperationType =
        this.getPrimitiveType(createOperationDto);

      const createOperation = this.operationsMap[type]({
        values: createOperationDto,
      });

      if (createOperation instanceof ReferenceOperation) {
        createOperation.setReferenceContextVisitor(referenceContextVisitor);
      }

      return createOperation;
    }

    if (typeof createOperationDto == 'object') {
      const mappedObject = this.mapObject(
        createOperationDto,
        referenceContextVisitor,
      );

      if (mappedObject instanceof TestBackOperation) {
        mappedObject.setReferenceContextVisitor(referenceContextVisitor);
      }

      return mappedObject;
    }
  }

  mapObject(
    createOperationDto: CreateOperationDto,
    referenceContextVisitor: ReferenceContext,
  ) {
    let mappedValues = [];

    mappedValues = createOperationDto.values.map((value) =>
      this.create(value, referenceContextVisitor),
    );

    if (!this.operationsMap[createOperationDto.type]) {
      throw new BadRequestException('Operation type does not exist');
    }

    return this.operationsMap[createOperationDto.type]({
      values: mappedValues,
    });
  }

  mapString(createOperationDto: string): OperationInterface<string, number> {
    throw new Error('String mapping does not implemented');
  }

  plainToDto(plainValue: any): CreateOperationDto[] {
    if (
      [CreateOperationType.PRIM, CreateOperationType.REF].includes(
        plainValue.type,
      )
    ) {
      return plainValue.values;
    }

    const mappedValues = plainValue.values.map((value) =>
      this.mapPlainToInstance(value),
    );

    return mappedValues;
  }

  mapPlainToInstance(value) {
    let mappedValue: CreateOperationDto;

    if (this.isPrimitive(value)) {
      const type: CreateOperationType = this.getPrimitiveType(value);

      mappedValue = plainToInstance(CreateOperationDto, {
        type,
        values: [value],
      });
    } else if (typeof value == 'object') {
      mappedValue = plainToInstance(CreateOperationDto, value);
    }

    return mappedValue;
  }

  getPrimitiveType(value: any): CreateOperationType {
    return this.isReference(value)
      ? CreateOperationType.REF
      : CreateOperationType.PRIM;
  }

  private isPrimitive(value: any): boolean {
    if (
      typeof value == 'string' ||
      typeof value == 'number' ||
      typeof value == 'boolean'
    ) {
      return true;
    }

    return false;
  }

  private isReference(value: string) {
    if (typeof value == 'string' && value.includes('::')) {
      return true;
    }
    return false;
  }
}
