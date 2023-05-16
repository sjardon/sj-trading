import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import configs from 'src/configs';
import { DatabaseService } from './database/services/database.service';
import { HelpersModule } from './helpers/helpers.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      // connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: (databaseOptionsService: DatabaseService) =>
        databaseOptionsService.generateConnection(),
    }),
    DatabaseModule,
    HelpersModule,
  ],
})
export class CommonModule {}
