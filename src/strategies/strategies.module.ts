import { Module } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { StrategiesController } from './strategies.controller';
import { SignalsService } from './signals/signals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyEntity } from './entities/strategy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StrategyEntity])],
  controllers: [StrategiesController],
  providers: [StrategiesService, SignalsService],
  exports: [StrategiesService, SignalsService],
})
export class StrategiesModule {}
