import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const databaseUri: string = configService.get<string>('database.host');
  const env: string = configService.get<string>('app.env');
  const host: string = configService.get<string>('app.host');
  const port: number = configService.get<number>('app.port');

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );

  const logger = new Logger();
  await app.listen(port, host);

  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');
}
bootstrap();
