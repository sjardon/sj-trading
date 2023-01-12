import { Injectable } from '@nestjs/common';
import { IndicatorEntity } from '../indicators/entities/indicator.entity';
import { SignalEntity } from './entities/signal.entity';

@Injectable()
export class SignalsService {
  exec(signal: SignalEntity): boolean {
    return signal.operation.resolve();
  }
}
