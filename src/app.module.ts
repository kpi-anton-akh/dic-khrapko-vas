import { Module } from '@nestjs/common';
import { FilmsModule } from './modules/films';
import { SqlDatabaseModule } from './systems/database';
import { AppConfigModule } from './config';

@Module({
  imports: [AppConfigModule, SqlDatabaseModule, FilmsModule],
})
export class AppModule {}
