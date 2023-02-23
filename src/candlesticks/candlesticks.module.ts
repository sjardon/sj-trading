import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorsModule } from '../indicators/indicators.module';
import { AdaptersModule } from '../adapters/adapters.module';
import { CandlesticksService } from './candlesticks.service';
import { CandlestickEntity } from './entities/candlestick.entity';

@Module({
  providers: [CandlesticksService],
  exports: [CandlesticksService],
  imports: [
    TypeOrmModule.forFeature([CandlestickEntity]),
    AdaptersModule,
    IndicatorsModule,
  ],
})
export class CandlesticksModule {}
