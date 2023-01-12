import { Collection } from '../utils/collections/collection.class';
import {
  CandlestickEntity,
  InputCandlestickEntity,
} from './entities/candlestick.entity';

export class CandlestickCollection extends Collection {
  static serialize(
    inputCandlesticks: InputCandlestickEntity[],
  ): CandlestickEntity[] {
    return inputCandlesticks.map(
      (candlestick) => new CandlestickEntity(candlestick),
    );
  }

  // getClosures(): number[] {
  //   return this.map((candlestick) => candlestick.close);
  // }

  // getOpenings(): number[] {
  //   return this.map((candlestick) => candlestick.open);
  // }

  // getHighs(): number[] {
  //   return this.map((candlestick) => candlestick.high);
  // }

  // getLowes(): number[] {
  //   return this.map((candlestick) => candlestick.high);
  // }
}
