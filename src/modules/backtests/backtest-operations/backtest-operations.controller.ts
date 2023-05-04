import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BacktestOperationsService } from './backtest-operations.service';
import { CreateBacktestOperationDto } from './dto/create-backtest-operation.dto';
import { UpdateBacktestOperationDto } from './dto/update-backtest-operation.dto';

@Controller('backtest-operations')
export class BacktestOperationsController {}
