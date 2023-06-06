import { Injectable } from '@nestjs/common';
import { TradingSessionEntity } from '../entities/trading-session.entity';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class TradingSessionsStatusService {
  private _tradingSessions: Map<string, BehaviorSubject<TradingSessionEntity>> =
    new Map();

  add(id: string, tradingSession: TradingSessionEntity) {
    // this.tradingSessions$.pipe(); //.push(new Subject());
    this._tradingSessions.set(
      id,
      new BehaviorSubject<TradingSessionEntity>(tradingSession),
    );
  }

  get(id: string) {
    if (!this._tradingSessions.has(id)) {
      throw new Error('TradingSession status doesnot exists');
    }

    return this._tradingSessions.get(id).asObservable();
  }

  update(id: string, tradingSession: TradingSessionEntity) {
    if (this._tradingSessions.has(id)) {
      this._tradingSessions.get(id).next(tradingSession);
    }
  }
  remove(id: string) {}
}
