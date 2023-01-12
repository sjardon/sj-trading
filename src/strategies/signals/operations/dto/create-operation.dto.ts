import {
  plainToClass,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { OperationsFactory } from '../operations.factory';

export enum CreateOperationType {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  GT = 'GT',
  GT_EQ = 'GT_EQ',
  LT = 'LT',
  LT_EQ = 'LT_EQ',
  EQ = 'EQ',
  ADD = 'ADD',
  SUB = 'SUB',
  DIV = 'DIV',
  MLP = 'MLP',
  PRIM = 'PRIM',
  REF = 'REF',
}

export class CreateOperationDto {
  @IsEnum(CreateOperationType)
  type: CreateOperationType;

  @ValidateNested({ each: true })
  @ValidateIf(
    (obj) =>
      ![CreateOperationType.PRIM, CreateOperationType.REF].includes(obj.type),
  )
  @Transform(({ obj }) => new OperationsFactory().plainToDto(obj))
  values: Array<boolean | number | string | CreateOperationDto>;
}
