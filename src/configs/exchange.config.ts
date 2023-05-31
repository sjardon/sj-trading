import { registerAs } from '@nestjs/config';

export default registerAs(
  'exchange',
  (): Record<string, any> => ({
    env: process.env.EXCHANGE_ENV,
    binance: {
      apiKey: process.env.BINANCE_API_KEY,
      secretKey: process.env.BINANCE_SECRET_KEY,
    },
  }),
);
