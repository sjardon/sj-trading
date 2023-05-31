import { Module } from '@nestjs/common';
import { MarketsService } from './services/markets.service';

@Module({
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
