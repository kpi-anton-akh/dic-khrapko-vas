import { Injectable } from '@nestjs/common';

import { FilmGenreEntity } from './film-genre.entity';
import { GenresService } from '../genres/genres.service';
import { FilmsService } from '../films/films.service';
import { BlobStorage } from 'src/systems/blob-storage/blob-storage';

@Injectable()
export class FilmGenresService {
  constructor(
    private readonly filmsService: FilmsService,
    private readonly genresService: GenresService,
    private readonly filmGenresStorage: BlobStorage,
  ) {}

  public async createOne(
    filmId: string,
    genreId: string,
  ): Promise<FilmGenreEntity> {
    await this.filmsService.findOne({ id: filmId });

    await this.genresService.findOneById(genreId);

    const relationFileName = `${filmId}_${genreId}`;

    const exists = await this.filmGenresStorage.containsFileByName(
      relationFileName,
    );

    if (!exists) {
      await this.filmGenresStorage.putContent(relationFileName);
    }

    return new FilmGenreEntity(filmId, genreId);
  }

  public async getGenresByFilmId(filmId: string): Promise<string[]> {
    await this.filmsService.findOne({ id: filmId });

    return this.filmGenresStorage.findByFilm(filmId);
  }
}
