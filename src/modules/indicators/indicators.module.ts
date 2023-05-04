import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from './entities/indicator.entity';
import { IndicatorsService } from './services/indicators.service';

@Module({
  providers: [IndicatorsService],
  exports: [IndicatorsService],
  imports: [TypeOrmModule.forFeature([IndicatorEntity])],
})
export class IndicatorsModule {}
