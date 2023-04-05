import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'backtestProfit',
  expression: `
    select 
    bt.id as backtest_id,
    open_ord."executedQty" / close_ord."executedQty" - 1 as profit,
    to_timestamp(cast (open_ord."transactTime" as numeric) / 1000) as open_time,
    to_timestamp(cast (close_ord."transactTime" as numeric) / 1000) as close_time
    from backtest bt 
    inner join "backtestOperation" op on op."backtestId" = bt.id 
    inner join "backtestOrder" open_ord on op."openOrderId" = open_ord.id
    inner join "backtestOrder" close_ord on op."closeOrderId" = close_ord.id
    `,
})
export class BacktestProfitView {
  @ViewColumn()
  backtestId: string;

  @ViewColumn()
  profit: number;

  @ViewColumn()
  openTime: number;

  @ViewColumn()
  closeTime: number;
}
