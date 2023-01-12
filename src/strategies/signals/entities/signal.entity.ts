import { Entity } from 'typeorm';
import { OperationInterface } from '../operations/operation.interface';

export enum SignalAction {
  BUY = 'BUY',
  SELL = 'SELL',
  OPEN_SHORT = 'OPEN_SHORT',
  OPEN_LONG = 'OPEN_LONG',
  CLOSE_SHORT = 'CLOSE_SHORT',
  CLOSE_LONG = 'CLOSE_LONG',
  NOTHING = 'NOTHING',
}
export type InputSignalEntity = {
  action: SignalAction;
  operation: OperationInterface<unknown, boolean>;
};

@Entity()
export class SignalEntity {
  action: SignalAction;
  operation: OperationInterface<unknown, boolean>;

  constructor({ action, operation }: InputSignalEntity) {
    this.action = action;
    this.operation = operation;
  }
}
