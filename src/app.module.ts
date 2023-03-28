import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './modules/films';
import { DatabaseModule } from './systems/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    FilmsModule,
  ],
})
export class AppModule {}
