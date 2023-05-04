import { CandlestickEntity } from '../../candlesticks/entities/candlestick.entity';

export function ATR(candlesticks: CandlestickEntity[], periods: number) {
  // I need periods plus two to get first the last TR and the current ATR

  const currentCandlestick = candlesticks.slice(
    candlesticks.length - (periods + 2),
  );

  const prevTR = TR(currentCandlestick.slice(0, -1));

  const currentTR = TR(currentCandlestick.slice(1));

  return (prevTR * (periods - 1) + currentTR) / periods;
}

function TR(candlesticks: CandlestickEntity[]) {
  let tr = 0;

  for (let i = 1; i < candlesticks.length; i++) {
    const { high, low } = candlesticks[i];
    let { close: prevClose } = candlesticks[i - 1];

    if (!prevClose) {
      prevClose = 0;
    }

    tr += Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose),
    );
  }

  return tr / (candlesticks.length - 1);
}
