import { Module } from '@nestjs/common';
import { FilmsModule } from './modules/films';
import { NosqlDatabaseModule, SqlDatabaseModule } from './systems/database';
import { AppConfigModule } from './config';

@Module({
  imports: [
    AppConfigModule,
    SqlDatabaseModule,
    NosqlDatabaseModule,
    FilmsModule,
  ],
})
export class AppModule {}
