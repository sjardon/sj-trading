import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'backtestCandlestick',
  expression: `
  SELECT bt.id AS backtestid,
  c.id AS candlestickid,
  c.symbol,
  c.open,
  c.close,
  c.high,
  c.low,
  to_timestamp(c."openTime"::double precision) AS opentime,
  to_timestamp(c."closeTime"::double precision) AS closetime,
  c.volume
 FROM backtest bt
   JOIN candlestick c ON bt.symbol::text = c.symbol::text AND bt."interval"::text = c."interval"::text AND bt."startTime" <= to_timestamp(c."openTime"::double precision) AND bt."endTime" >= to_timestamp(c."closeTime"::double precision);
    `,
})
export class BacktestCandlestickView {
  @ViewColumn({
    name: 'backtestid',
  })
  backtestId: string;

  @ViewColumn({
    name: 'candlestickid',
  })
  candlestickId: string;

  @ViewColumn()
  symbol: number;

  @ViewColumn()
  open: number;

  @ViewColumn()
  close: number;

  @ViewColumn()
  high: number;

  @ViewColumn()
  low: number;

  @ViewColumn()
  volume: number;

  @ViewColumn({
    name: 'opentime',
  })
  openTime: number;

  @ViewColumn({
    name: 'closetime',
  })
  closeTime: number;
}
