import { Module } from '@nestjs/common';
import { ExchangeClient } from './exchange/exchange.client';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ExchangeClient],
  exports: [ExchangeClient],
})
export class AdaptersModule {}
