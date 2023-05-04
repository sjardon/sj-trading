import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationDto } from './create-operation.dto';

export class UpdateStrategyDto extends PartialType(CreateOperationDto) {}
