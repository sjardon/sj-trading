# SAGA pattern.

Orchestrate events thinking in the entities states.

# Some modules by layers:

- Initialization => BootstrapModule: Get strategy, portfolio, timeframe, etc.
- Research => DataModule: Get data from different datasources. Specially, could be historical candlesticks, but we can add other valuable data.
- Pre-Trade Analysis =>

  - TransactionCostModule
  - RisckModule
  - AlphaModule: https://www.investopedia.com/terms/a/alpha.asp

    - Understanding Alpha
    - Alpha is _one of five popular technical investment risk ratios_. The others are _beta, standard deviation, R-squared, and the Sharpe ratio_. These are all statistical measurements used in modern portfolio theory (MPT). All of these indicators are intended to help investors determine the risk-return profile of an investment.
    - Active portfolio managers seek to generate alpha in diversified portfolios, with diversification intended to eliminate unsystematic risk. Because alpha represents the performance of a portfolio relative to a benchmark, it is often considered to represent the value that a portfolio manager adds to or subtracts from a fund's return.

- Trading signals => StrategyModule
- Trade execution => TradeModule
