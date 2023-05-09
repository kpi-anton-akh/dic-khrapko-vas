import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import { AppConfigService } from 'src/config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getDbConfig(),
      imports: [AppConfigModule],
      inject: [AppConfigService],
    }),
  ],
})
export class DatabaseModule {}
