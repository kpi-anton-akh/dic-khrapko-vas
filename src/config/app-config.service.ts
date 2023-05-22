import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { NodeModeEnum } from 'src/common/enums';
import { convertBoolStrToBoolean } from 'src/common/helpers';
import { FilmGenreEntity } from 'src/modules/film-genres/film-genre.entity';
import { FilmEntity } from 'src/modules/films/entities';

export const TYPEORM_CONNECTION_NAME = 'typeormSqlConnection';
export const TYPEORM_CONNECTION_NAME_NOSQL = 'typeormNosqlConnection';

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

  public getNosqlDbConfig(): TypeOrmModuleOptions {
    return this.getMongoConfig();
  }

  getPostgresConfig(): TypeOrmModuleOptions {
    return {
      type: this.get<'postgres'>('TYPEORM_TYPE'),
      name: TYPEORM_CONNECTION_NAME,
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
      entities: [FilmEntity],
      migrations: [join(__dirname, '../systems/database/migrations/*.{ts,js}')],
    };
  }

  getSqliteConfig(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'sqlite'>('TYPEORM_TYPE'),
      name: TYPEORM_CONNECTION_NAME,
      database: this.configService.get<string>('TYPEORM_DATABASE'),
      cache: convertBoolStrToBoolean(this.get('TYPEORM_CACHE')),
      logging: this.get('TYPEORM_LOGGING'),
      dropSchema: convertBoolStrToBoolean(this.get('TYPEORM_DROP_SCHEMA')),
      synchronize: convertBoolStrToBoolean(this.get('TYPEORM_SYNCHRONIZE')),
      migrationsRun: convertBoolStrToBoolean(
        this.get('TYPEORM_MIGRATIONS_RUN'),
      ),
      entities: [FilmEntity],
      migrations: [join(__dirname, '../systems/database/migrations/*.{ts,js}')],
    };
  }

  getMongoConfig(): TypeOrmModuleOptions {
    return {
      type: this.get<'postgres'>('TYPEORM_TYPE_NOSQL'),
      name: TYPEORM_CONNECTION_NAME_NOSQL,
      host: this.get('TYPEORM_HOST_NOSQL'),
      port: this.get('TYPEORM_PORT_NOSQL'),
      cache: convertBoolStrToBoolean(this.get('TYPEORM_CACHE_NOSQL')),
      logging: this.get('TYPEORM_LOGGING_NOSQL'),
      database: this.get<string>('TYPEORM_DATABASE_NOSQL'),
      username: this.get('TYPEORM_USERNAME_NOSQL'),
      password: this.get('TYPEORM_PASSWORD_NOSQL'),
      extra: {
        ssl: convertBoolStrToBoolean(this.get('TYPEORM_SSL_NOSQL')),
      },
      dropSchema: convertBoolStrToBoolean(
        this.get('TYPEORM_DROP_SCHEMA_NOSQL'),
      ),
      synchronize: convertBoolStrToBoolean(
        this.get('TYPEORM_SYNCHRONIZE_NOSQL'),
      ),
      migrationsRun: convertBoolStrToBoolean(
        this.get('TYPEORM_MIGRATIONS_RUN_NOSQL'),
      ),
      entities: [FilmGenreEntity],
    };
  }
}
