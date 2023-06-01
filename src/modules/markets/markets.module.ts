import { Module } from '@nestjs/common';
import { MarketsService } from './services/markets.service';
import { AdaptersModule } from '../adapters/adapters.module';

@Module({
  providers: [MarketsService],
  exports: [MarketsService],
  imports: [AdaptersModule],
})
export class MarketsModule {}
