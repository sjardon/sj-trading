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

export function isMorningStarDoji(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 3);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];
  const prev_2 = candlesticks[candlesticks.length - 3];

  return (
    prev_2.close < prev_2.open &&
    Math.abs(prev_2.close - prev_2.open) / (prev_2.high - prev_2.low) >= 0.7 &&
    Math.abs(prev.close - prev.open) / (prev.high - prev.low) < 0.1 &&
    current.close > current.open &&
    Math.abs(current.close - current.open) / (current.high - current.low) >=
      0.7 &&
    prev_2.close > prev.close &&
    prev_2.close > prev.open &&
    prev.close < current.open &&
    prev.open < current.open &&
    current.close > prev_2.close &&
    prev.high - Math.max(prev.close, prev.open) >
      3 * Math.abs(prev.close - prev.open) &&
    Math.min(prev.close, prev.open) - prev.low >
      3 * Math.abs(prev.close - prev.open)
  );
}

export function isEveningStarDoji(candlesticks: CandlestickEntity[]): boolean {
  checkLengthOrTrhowError(candlesticks, 3);

  const current = candlesticks[candlesticks.length - 1];
  const prev = candlesticks[candlesticks.length - 2];
  const prev_2 = candlesticks[candlesticks.length - 3];

  return (
    prev_2.close > prev_2.open &&
    Math.abs(prev_2.close - prev_2.open) / (prev_2.high - prev_2.low) >= 0.7 &&
    Math.abs(prev.close - prev.open) / (prev.high - prev.low) < 0.1 &&
    current.close < current.open &&
    Math.abs(current.close - current.open) / (current.high - current.low) <
      0.7 &&
    prev_2.close < prev.close &&
    prev_2.close < prev.open &&
    prev.close > current.open &&
    prev.open > current.open &&
    current.close < prev_2.close &&
    prev.high - Math.max(prev.close, prev.open) >
      3 * Math.abs(prev.close - prev.open) &&
    Math.min(prev.close, prev.open) - prev.low >
      3 * Math.abs(prev.close - prev.open)
  );

  // (b_prev_close < b_prev_open and
  //   abs(b_prev_close - b_prev_open) / (b_prev_high - b_prev_low) >= 0.7 and
  //   abs(prev_close - prev_open) / (prev_high - prev_low) < 0.1 and
  //   close > open and
  //   abs(close - open) / (high - low) >= 0.7 and
  //   b_prev_close > prev_close and
  //   b_prev_close > prev_open and
  //   prev_close < open and
  //   prev_open < open and
  //   close > b_prev_close
  //   and (prev_high - max(prev_close, prev_open)) > (3 * abs(prev_close - prev_open))
  //   and (min(prev_close, prev_open) - prev_low) > (3 * abs(prev_close - prev_open)))
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
