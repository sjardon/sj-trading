import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorsModule } from '../indicators/indicators.module';
import { AdaptersModule } from '../adapters/adapters.module';
import { CandlesticksService } from './services/candlesticks.service';
import { CandlestickEntity } from './entities/candlestick.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { CandlesticksCacheService } from './services/candlesticks-cache.service';

@Module({
  providers: [CandlesticksService, CandlesticksCacheService],
  exports: [CandlesticksService],
  imports: [
    TypeOrmModule.forFeature([CandlestickEntity]),
    CacheModule.register(),
    AdaptersModule,
    IndicatorsModule,
  ],
})
export class CandlesticksModule {}
