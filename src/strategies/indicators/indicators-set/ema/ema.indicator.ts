// import { CandlestickCollection } from '../../candlestick/candlestick.collection';
// import { CandlestickEntity } from '../../candlestick/candlestick.entity';
// // import { EMA } from "../../utilities/operations.util";
// import { IndicatorName } from '../indicator-name.enum';
// import { IndicatorInterface } from '../indicator.interface';
// import { FasterEMA } from 'trading-signals';
// import { IndicatorEntity } from '../indicator.entity';

// export type InputEmaIndicator = {
//   candlesticks: CandlestickEntity[];
//   periods?: number;
// };

// export class EmaIndicator implements IndicatorInterface<IndicatorEntity> {
//   candlesticks: CandlestickEntity[];
//   periods: number;

//   constructor(inputEmaIndicator: InputEmaIndicator) {
//     const { candlesticks, periods } = inputEmaIndicator;

//     this.candlesticks = candlesticks;
//     this.periods = periods || 5;
//   }

//   exec = (name: string = '') => {
//     const ema = new FasterEMA(this.periods);

//     const closures = CandlestickCollection.getValuesOf(
//       'close',
//       this.candlesticks,
//     ) as number[];

//     for (const close of closures) {
//       ema.update(close);
//     }

//     const value = ema.getResult();

//     return new IndicatorEntity({
//       name: name.length > 0 ? name : IndicatorName.EMA,
//       value,
//     });
//   };
// }
