import { Module } from '@nestjs/common';
import { FilmsModule } from './modules/films';
import { NosqlDatabaseModule, SqlDatabaseModule } from './systems/database';
import { AppConfigModule } from './config';
import { FilmGenresModule } from './modules/film-genres';

@Module({
  imports: [
    AppConfigModule,
    SqlDatabaseModule,
    NosqlDatabaseModule,
    FilmsModule,
    FilmGenresModule,
  ],
})
export class AppModule {}
