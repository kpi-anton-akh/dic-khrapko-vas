import { Module } from '@nestjs/common';
import { GenresModule } from '../genres';
import { FilmsModule } from '../films';
import { FilmGenresController } from './film-genres.controller';
import { FilmGenresService } from './film-genres.service';
import { BlobStorage } from 'src/systems/blob-storage/blob-storage';
import { AppConfigService } from 'src/config/app-config.service';
import { FILM_GENRES_CONTAINER_NAME } from 'src/common/constants';
import { AppConfigModule } from 'src/config';

@Module({
  imports: [FilmsModule, GenresModule, AppConfigModule],
  controllers: [FilmGenresController],
  providers: [
    FilmGenresService,
    {
      provide: BlobStorage,
      useFactory: (appConfigService: AppConfigService) =>
        new BlobStorage(
          {
            connectionString: appConfigService.get<string>(
              'AZURE_BLOB_CONNECTION_STRING',
            ),
          },
          FILM_GENRES_CONTAINER_NAME,
        ),
      inject: [AppConfigService],
    },
  ],
  exports: [FilmGenresService],
})
export class FilmGenresModule {}
