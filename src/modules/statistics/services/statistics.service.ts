import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BacktestOperationEntity } from '../../backtests/backtest-operations/entities/backtest-operation.entity';
import { BacktestEntity } from '../../backtests/entities/backtest.entity';
import { BacktestStatisticEntity } from '../entities/statistic.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(BacktestStatisticEntity)
    private backtestBacktestStatisticRepository: Repository<BacktestStatisticEntity>,
  ) {}

  async getByBacktest({ backtestId }) {
    // TODO: Add Try-Catch

    return await this.backtestBacktestStatisticRepository.findOne({
      where: { backtest: { id: backtestId } },
    });
  }

  async generateFromOperations(
    backtest: BacktestEntity,
    operations: BacktestOperationEntity[],
  ) {
    try {
      operations = operations.filter(
        (operation) => operation['openOrder'] && operation['closeOrder'],
      );
      const statistic = this.backtestBacktestStatisticRepository.create({
        backtest,
        totalRate: this.getTotalRate(operations),
        profiteableCount: this.getProfiteableCount(operations),
        unprofiteableCount: this.getUnprofiteableCount(operations),
        profiteableAvg: this.getProfiteableAvg(operations),
        unprofiteableAvg: this.getUnprofiteableAvg(operations),
      });

      return await this.backtestBacktestStatisticRepository.save(statistic);
    } catch (err) {
      // console.log(err);
    }
  }

  private getTotalRate(operations: BacktestOperationEntity[]): number {
    return operations.reduce((accumulator, currentOperation) => {
      const rate = this.getRateByOperation(currentOperation);
      return accumulator * rate;
    }, 1);
  }

  getRateByOperation(operation: BacktestOperationEntity) {
    if (operation.isBoth() || operation.isLong()) {
      return operation.closeOrder.executedQty / operation.openOrder.executedQty;
    } else if (operation.isShort()) {
      return operation.openOrder.executedQty / operation.closeOrder.executedQty;
    }

    return 1;
  }

  private getProfiteableCount(operations: BacktestOperationEntity[]): number {
    return operations.filter((operation) =>
      this.isProfiteableByOperation(operation),
    ).length;
  }

  isProfiteableByOperation(operation: BacktestOperationEntity) {
    if (operation.isBoth() || operation.isLong()) {
      return operation.closeOrder.executedQty > operation.openOrder.executedQty;
    } else if (operation.isShort()) {
      return operation.openOrder.executedQty > operation.closeOrder.executedQty;
    }
  }

  private getUnprofiteableCount(operations: BacktestOperationEntity[]): number {
    return operations.filter(
      (operation) => !this.isProfiteableByOperation(operation),
    ).length;
  }

  private getProfiteableAvg(operations: BacktestOperationEntity[]): number {
    const profiteableOperations = operations.filter((operation) =>
      this.isProfiteableByOperation(operation),
    );

    return (
      profiteableOperations.reduce((accumulator, currentOperation) => {
        const rate = this.getRateByOperation(currentOperation);
        return accumulator + rate;
      }, 0) / profiteableOperations.length
    );
  }

  private getUnprofiteableAvg(operations: BacktestOperationEntity[]): number {
    const unprofiteableOperations = operations.filter(
      (operation) => !this.isProfiteableByOperation(operation),
    );
    return (
      unprofiteableOperations.reduce((accumulator, currentOperation) => {
        const rate = this.getRateByOperation(currentOperation);
        return accumulator + rate;
      }, 0) / unprofiteableOperations.length
    );
  }
}
