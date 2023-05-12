import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import {
  AppConfigService,
  TYPEORM_CONNECTION_NAME_NOSQL,
} from 'src/config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getNosqlDbConfig(),
      name: TYPEORM_CONNECTION_NAME_NOSQL,
      imports: [AppConfigModule],
      inject: [AppConfigService],
    }),
  ],
})
export class NosqlDatabaseModule {}
