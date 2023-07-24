# SJ-Trading

## Disclaimer

This project is for my personal learning, practice and usage. It's not tested enough to be running in production.

## Motivation

The goal is to buy and sell stocks getting profit of each operation. To achieve that we have two main services: Backtest service and TradingSession service (not running yet).

## Build process

1.  Create a copy from `.env.example` file and call it `.env` in the root project folder.
2.  Fill the environment vars with this info:

```
APP_NAME=sj-trader
APP_ENV=local
HOST=localhost
PORT=3000

POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=trading
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

AUTH0_ISSUER_URL=
AUTH0_AUDIENCE=
```

3. Run docker:

```bash
docker-compose up
```

4. Install node dependencies:

```bash
npm install
```

5. Finally, start the project:

```bash
npm run start
```

## Backtest Service

Backtest service allow us to test strategies getting an estimate of theirs profit rate before get them running with our real account.
Our Backtest service has the avility to save the differents strategies and the backtests that we ran with them, so we can check later wich is the bestone and review the good and bad trades. To do so we need to add a new strategy and create a new backtest with it.

### Create a new strategy

Once we have our app running we should call it with something like this:

```curl
curl --location 'localhost:3000/strategies' \
--header 'Content-Type: application/json' \
--data '{
  "name": "sma-crossover",
  "stopLoss": 0.01,
  "takeProfit": 0.02,
  "indicators": [
    { "name": "SMA_5", "configuration": { "type": "SMA", "lookback": 5 } },
    { "name": "SMA_20", "configuration": { "type": "SMA", "lookback": 20 } },
  ],
  "signals": [
    {
      "action": "BUY",
      "operation": {
        "type": "GT",
        "values": ["IND::SMA_5","IND::SMA_20"]
      }
    },
    {
      "action": "SELL",
      "operation": {
        "type": "LT",
        "values": ["IND::SMA_5","IND::SMA_20"]
      }
    }
  ]
}
'
```

Short description of what we are doing here:

1. Giving a name to identify the strategy with the `name` property.
2. Setting indicators that will be used inside the operators with the `indicators` property.
3. Setting a stop loss and take profit params that could be used by the signals section. If we don't call them inside the `SELL` signal they won't be raised.
4. Setting diferents signals to test and operate. It is composed by the operations that we want to check. In the above example we have run a sma crossover strategy making usage of the indicators that we have setted before. Internally the `Analyzer` component will check wich signal confirm the creation of a new order and ask for it creation to the `Operation` component.

Now we can set the new strategy id and call our backtest service to check the profits result:

```
curl --location 'localhost:3000/backtests' \
--header 'Content-Type: application/json' \
--data '{
  "name": "sma-crossover-backtest",
  "strategyId": "{{strategyId}}",
  "symbol": "BTCUSDT",
  "interval": "1h",
  "startTime": "2023-01-01T00:00:00.00Z",
  "endTime": "2023-02-01T00:00:00.00Z"
}'
```

We have an humble panel to see the results. You can go here to check it:

```
http://localhost:3000/statistics/backtest/{{backtestId}}
```

### Next steps for Backtest service

 - Run backtests in scheduled tasks instead.
 - Use cqrs method.
 - Refactor of backtests.service.ts in differents command handlers.
 - Add GET and DELETE methods for strategies and backtests.
 - Save candlesticks samples in some cache db or files.

## TradingSession service

WIP
