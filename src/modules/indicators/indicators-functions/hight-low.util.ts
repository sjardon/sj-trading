import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';

export function isLow(
  values: number[],
  valueIndex: number,
  leftOffset: number,
  rightOffset: number,
) {
  if (valueIndex < leftOffset || values.length < valueIndex + rightOffset + 1) {
    return false;
  }

  for (let i = valueIndex - leftOffset; i < valueIndex; i++) {
    if (values[i] < values[i + 1]) {
      return false;
    }
  }

  for (let i = valueIndex; i < valueIndex + rightOffset; i++) {
    if (values[i] > values[i + 1]) {
      return false;
    }
  }

  return true;
}

export function isHight(
  values: number[],
  candlestickIndex: number,
  leftOffset: number,
  rightOffset: number,
) {
  if (
    candlestickIndex < leftOffset ||
    values.length < candlestickIndex + rightOffset + 1
  ) {
    return false;
  }

  for (let i = candlestickIndex - leftOffset; i < candlestickIndex; i++) {
    if (values[i] > values[i + 1]) {
      return false;
    }
  }

  for (let i = candlestickIndex; i < candlestickIndex + rightOffset; i++) {
    if (values[i] < values[i + 1]) {
      return false;
    }
  }

  return true;
}
