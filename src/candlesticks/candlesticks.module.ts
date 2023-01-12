import { Module } from '@nestjs/common';
import { AdaptersModule } from '../adapters/adapters.module';
import { CandlesticksService } from './candlesticks.service';

@Module({
  providers: [CandlesticksService],
  exports: [CandlesticksService],
  imports: [AdaptersModule],
})
export class CandlesticksModule {}
