import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import {
  AppConfigService,
  TYPEORM_CONNECTION_NAME,
} from 'src/config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getSqlDbConfig(),
      name: TYPEORM_CONNECTION_NAME,
      imports: [AppConfigModule],
      inject: [AppConfigService],
    }),
  ],
})
export class SqlDatabaseModule {}
