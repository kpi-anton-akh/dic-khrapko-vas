import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dirname } from 'path';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('TYPEORM_TYPE'),
        name: configService.get('TYPEORM_NAME'),
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        cache: configService.get('TYPEORM_CACHE'),
        logging: configService.get('TYPEORM_LOGGING'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        dropSchema: configService.get('TYPEORM_DROP_SCHEMA'),
        synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
        migrationsRun: configService.get('TYPEORM_MIGRATIONS_RUN'),
        entities: [dirname(__dirname) + '/modules/**/*.entity.{ts,js}'],
        migrations: [__dirname + '/migrations/*.{ts,js}'],
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
