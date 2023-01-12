import { ReferenceVisitor } from 'src/utils/visitors/reference.visitor';
import { CreateSignalDto } from './dto/create-signal.dto';
import { SignalEntity } from './entities/signal.entity';
import { OperationInterface } from './operations/operation.interface';

import { OperationsFactory } from './operations/operations.factory';

export class SignalsFactory {
  create(
    createSignalsDto: CreateSignalDto[],
    referenceVisitor: ReferenceVisitor,
  ): SignalEntity[] {
    return createSignalsDto.map((signalDto) =>
      this.createOne(signalDto, referenceVisitor),
    );
  }

  createOne(
    createSignalDto: CreateSignalDto,
    referenceVisitor: ReferenceVisitor,
  ): SignalEntity {
    const mappedOperation = new OperationsFactory().create(
      createSignalDto.operation,
      referenceVisitor,
    ) as OperationInterface<unknown, boolean>;

    return new SignalEntity({
      action: createSignalDto.action,
      operation: mappedOperation,
    });
  }
}
