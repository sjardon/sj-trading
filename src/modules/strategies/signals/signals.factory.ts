import { ReferenceVisitor } from 'src/common/visitors/reference.visitor';
import { CreateSignalDto } from './dto/create-signal.dto';
import { SignalEntity } from './entities/signal.entity';
import { OperationInterface } from './operations/operation.interface';

import { OperationsFactory } from './operations/operations.factory';
import { ReferenceContext } from 'src/common/visitors/reference-contex.visitor';

export class SignalsFactory {
  create(
    createSignalsDto: CreateSignalDto[],
    referenceContextVisitor: ReferenceContext,
  ): SignalEntity[] {
    return createSignalsDto.map((signalDto) =>
      this.createOne(signalDto, referenceContextVisitor),
    );
  }

  createOne(
    createSignalDto: CreateSignalDto,
    referenceContextVisitor: ReferenceContext,
  ): SignalEntity {
    const mappedOperation = new OperationsFactory().create(
      createSignalDto.operation,
      referenceContextVisitor,
    ) as OperationInterface<unknown, boolean>;

    return new SignalEntity({
      action: createSignalDto.action,
      operation: mappedOperation,
    });
  }
}
