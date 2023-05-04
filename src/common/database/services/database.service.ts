import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}
  generateConnection(): TypeOrmModuleOptions {
    // POSTGRES_USER=admin
    // POSTGRES_PASSWORD=admin
    // POSTGRES_DB=trading
    // POSTGRES_HOST=localhost
    // POSTGRES_HOST=5432

    const env = this.configService.get<string>('app.env');
    const debug = this.configService.get<boolean>('db.postgres.debug');
    const host = this.configService.get<string>('db.postgres.host');
    const port = this.configService.get<number>('db.postgres.port');
    const database = this.configService.get<string>('db.postgres.name');
    const username = this.configService.get<string>('db.postgres.user');
    const password = this.configService.get<string>('db.postgres.password');

    // const host = 'localhost';
    // const port = 5432;
    // const database = 'trading';
    // const username = 'admin';
    // const password = 'admin';

    return {
      type: 'postgres',
      host,
      port,
      database,
      username,
      password,
      autoLoadEntities: true,
      synchronize: env == ENUM_APP_ENVIRONMENT.LOCAL ? true : false,
    };

    // throw new Error('Method not implemented.');
  }
}