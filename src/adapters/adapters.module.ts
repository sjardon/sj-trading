import { Module } from '@nestjs/common';
import { ExchangeClient } from './exchange/exchange.client';

@Module({
  providers: [ExchangeClient],
  exports: [ExchangeClient],
})
export class AdaptersModule {}
