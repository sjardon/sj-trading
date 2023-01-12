import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { SignalAction } from '../entities/signal.entity';
import { CreateOperationDto } from '../operations/dto/create-operation.dto';

export class CreateSignalDto {
  @IsEnum(SignalAction)
  action: SignalAction;

  @ValidateNested()
  @Type(() => CreateOperationDto)
  operation: CreateOperationDto;
}
