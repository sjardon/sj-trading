import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from './entities/indicator.entity';
import { IndicatorsService } from './indicators.service';

@Module({
  providers: [IndicatorsService],
  exports: [IndicatorsService],
  imports: [TypeOrmModule.forFeature([IndicatorEntity])],
})
export class IndicatorsModule {}
