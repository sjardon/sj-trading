import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationInterface } from './operation.entity.interface';

export abstract class OperationEntityAbstract
  extends BaseEntity
  implements OperationInterface
{
  openOrder?;
  closeOrder?;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  isOpen(): boolean {
    if (!this.closeOrder && this.openOrder) {
      return true;
    }

    return false;
  }

  isClose(): boolean {
    if (this.closeOrder) {
      return true;
    }

    return false;
  }

  isBoth(): boolean {
    return this.openOrder?.positionSide == 'BOTH' ? true : false;
  }

  isLong(): boolean {
    return this.openOrder?.positionSide == 'LONG' ? true : false;
  }

  isShort(): boolean {
    return this.openOrder?.positionSide == 'SHORT' ? true : false;
  }
}
