import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { NodeModeEnum } from 'src/common/enums';
import { convertBoolStrToBoolean } from 'src/common/helpers';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get<T>(key: string): T {
    return this.configService.get<T>(key);
  }

  public isMode(mode: NodeModeEnum): boolean {
    return this.get('NODE_ENV') === mode;
  }

  public getSqlDbConfig(): TypeOrmModuleOptions {
    if (this.isMode(NodeModeEnum.TEST)) return this.getSqliteConfig();
    return this.getPostgresConfig();
  }

  getPostgresConfig(): TypeOrmModuleOptions {
    return {
      type: this.get<'postgres'>('TYPEORM_TYPE'),
      name: this.get('TYPEORM_NAME'),
      host: this.get('TYPEORM_HOST'),
      port: this.get('TYPEORM_PORT'),
      cache: convertBoolStrToBoolean(this.get('TYPEORM_CACHE')),
      logging: this.get('TYPEORM_LOGGING'),
      database: this.get<string>('TYPEORM_DATABASE'),
      username: this.get('TYPEORM_USERNAME'),
      password: this.get('TYPEORM_PASSWORD'),
      extra: {
        ssl: convertBoolStrToBoolean(this.get('TYPEORM_SSL')),
      },
      dropSchema: convertBoolStrToBoolean(this.get('TYPEORM_DROP_SCHEMA')),
      synchronize: convertBoolStrToBoolean(this.get('TYPEORM_SYNCHRONIZE')),
      migrationsRun: convertBoolStrToBoolean(
        this.get('TYPEORM_MIGRATIONS_RUN'),
      ),
      entities: [join(__dirname, '../modules/**/*.entity.{ts,js}')],
      migrations: [join(__dirname, '../systems/database/migrations/*.{ts,js}')],
    };
  }

  getSqliteConfig(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'sqlite'>('TYPEORM_TYPE'),
      database: this.configService.get<string>('TYPEORM_DATABASE'),
      cache: convertBoolStrToBoolean(this.get('TYPEORM_CACHE')),
      logging: this.get('TYPEORM_LOGGING'),
      dropSchema: convertBoolStrToBoolean(this.get('TYPEORM_DROP_SCHEMA')),
      synchronize: convertBoolStrToBoolean(this.get('TYPEORM_SYNCHRONIZE')),
      migrationsRun: convertBoolStrToBoolean(
        this.get('TYPEORM_MIGRATIONS_RUN'),
      ),
      entities: [join(__dirname, '../modules/**/*.entity.{ts,js}')],
      migrations: [join(__dirname, '../systems/database/migrations/*.{ts,js}')],
    };
  }
}
