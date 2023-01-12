import { Module } from '@nestjs/common';
import { TradersService } from './traders.service';

@Module({
  providers: [TradersService],
  exports: [],
})
export class TradersModule {}
