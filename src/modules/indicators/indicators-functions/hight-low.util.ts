import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';

export function isLow(
  candlesticks: CandlestickEntity[],
  candlestickIndex: number,
  leftOffset: number,
  rightOffset: number,
) {
  if (
    candlestickIndex < leftOffset ||
    candlesticks.length < candlestickIndex + rightOffset + 1
  ) {
    return false;
  }

  for (let i = candlestickIndex - leftOffset; i < candlestickIndex; i++) {
    if (candlesticks[i].low > candlesticks[i + 1].low) {
      return false;
    }
  }

  for (let i = candlestickIndex; i < candlestickIndex + rightOffset; i++) {
    if (candlesticks[i].low < candlesticks[i + 1].low) {
      return false;
    }
  }

  return true;
}

export function isHight(
  candlesticks: CandlestickEntity[],
  candlestickIndex: number,
  leftOffset: number,
  rightOffset: number,
) {
  if (
    candlestickIndex < leftOffset ||
    candlesticks.length < candlestickIndex + rightOffset + 1
  ) {
    return false;
  }

  for (let i = candlestickIndex - leftOffset; i < candlestickIndex; i++) {
    if (candlesticks[i].high < candlesticks[i + 1].high) {
      return false;
    }
  }

  for (let i = candlestickIndex; i < candlestickIndex + rightOffset; i++) {
    if (candlesticks[i].high > candlesticks[i + 1].high) {
      return false;
    }
  }

  return true;
}
