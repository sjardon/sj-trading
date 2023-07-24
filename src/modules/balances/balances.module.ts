import { Module } from '@nestjs/common';
import { BalancesService } from './services/balances.service';
import { AdaptersModule } from '../adapters/adapters.module';

@Module({
  providers: [BalancesService],
  exports: [BalancesService],
  imports: [AdaptersModule],
})
export class BalancesModule {}
