import { FilmGenreEntity } from '../film-genre.entity';

export interface IFilmGenresRepository {
  createOne(entity: Partial<FilmGenreEntity>): Promise<FilmGenreEntity>;
  findAll(): Promise<FilmGenreEntity[]>;
  findOneById(id: string): Promise<FilmGenreEntity>;
  updateOne(
    entityToUpdate: FilmGenreEntity,
    entity: Partial<FilmGenreEntity>,
  ): Promise<FilmGenreEntity>;
  removeOne(entity: FilmGenreEntity): Promise<FilmGenreEntity>;
}
