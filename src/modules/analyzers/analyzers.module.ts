import { Module } from '@nestjs/common';
import { StrategiesModule } from '../strategies/strategies.module';
import { AnalyzersService } from './analyzers.service';

@Module({
  providers: [AnalyzersService],
  exports: [AnalyzersService],
  imports: [StrategiesModule],
})
export class AnalyzersModule {}
