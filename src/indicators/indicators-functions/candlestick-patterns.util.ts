import { CandlestickEntity } from 'src/candlesticks/entities/candlestick.entity';

function checkLengthOrTrhowError(candlesticks, length: number) {
  if (candlesticks.length < length) {
    throw new Error('Unable to recognize candlestick pattern, not enough data');
  }
}

export function isEngulfingBullish(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 2);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];

  return (
    current.isBullish() &&
    prev.isBearish() &&
    current.close >= prev.open &&
    current.open <= prev.close
  );
}

export function isEngulfingBearish(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 2);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];

  return (
    current.isBearish() &&
    prev.isBullish() &&
    current.open >= prev.close &&
    current.close <= prev.open
  );
}

export function isMorningStar(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 3);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];
  const prev_2 = candlesticks[candlesticks.length - 3];

  return (
    Math.max(prev.open, prev.close) <= prev_2.close &&
    prev_2.isBearish() &&
    current.isBullish() &&
    current.open > Math.max(prev.open, prev.close)
  );
}

export function isEveningStar(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 3);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];
  const prev_2 = candlesticks[candlesticks.length - 3];

  return (
    Math.min(prev.open, prev.close) >= prev_2.close &&
    prev_2.isBullish() &&
    current.isBearish() &&
    current.open > Math.min(prev.open, prev.close)
  );
}

export function isHammer(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 1);

  const current = candlesticks[candlesticks.length - 1];

  return (
    current.high - current.low > 3 * current.change() &&
    (current.close - current.low) / (current.high - current.low) > 0.6 &&
    (current.open - current.low) / (current.high - current.low) > 0.6
  );
}

export function isInvertedHammer(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 1);

  const current = candlesticks[candlesticks.length - 1];

  return (
    current.high - current.low > 3 * current.change() &&
    (current.high - current.close) / (current.high - current.low) > 0.6 &&
    (current.high - current.open) / (current.high - current.low) > 0.6
  );
}

export function isHangingMan(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 3);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];
  const prev_2 = candlesticks[candlesticks.length - 3];

  return (
    current.high - current.low > 4 * current.change() &&
    (current.close - current.low) / (current.high - current.low) > 0.75 &&
    (current.open - current.low) / (current.high - current.low) > 0.75 &&
    prev.high < current.open &&
    prev_2.high < current.open
  );
}
