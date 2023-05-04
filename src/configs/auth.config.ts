import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    auth0: {
      issuerUrl: process.env.AUTH0_ISSUER_URL,
      audience: process.env.AUTH0_AUDIENCE,
    },
  }),
);
