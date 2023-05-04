import { Module } from '@nestjs/common';
import { StrategiesService } from './services/strategies.service';
import { StrategiesController } from './controllers/strategies.controller';
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
