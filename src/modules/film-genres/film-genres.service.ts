import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { FilmGenresRepository } from './film-genres.repository';
import { FilmGenreEntity } from './film-genre.entity';
import { ErrorMessageEnum } from 'src/common/enums';

@Injectable()
export class FilmGenresService {
  constructor(private readonly filmGenresRepository: FilmGenresRepository) {}

  public async createOne(
    entity: Partial<FilmGenreEntity>,
  ): Promise<FilmGenreEntity> {
    return this.filmGenresRepository.createOne(entity).catch(() => {
      throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
    });
  }

  public async findAll(): Promise<FilmGenreEntity[]> {
    return this.filmGenresRepository.findAll().catch(() => {
      throw new NotFoundException(ErrorMessageEnum.FILM_GENRES_NOT_FOUND);
    });
  }

  public async findOneById(id: string): Promise<FilmGenreEntity> {
    return this.filmGenresRepository
      .findOneById(id)
      .then((entity) => {
        if (entity) return entity;
        throw new NotFoundException(ErrorMessageEnum.FILM_GENRE_NOT_FOUND);
      })
      .catch(() => {
        throw new NotFoundException(ErrorMessageEnum.FILM_GENRE_NOT_FOUND);
      });
  }

  public async updateOne(
    id: string,
    entity: Partial<FilmGenreEntity>,
  ): Promise<FilmGenreEntity> {
    const entityToUpdate = await this.findOneById(id);
    const { id: entityId } = await this.filmGenresRepository
      .updateOne(entityToUpdate, entity)
      .catch(() => {
        throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
      });

    return this.findOneById(entityId);
  }

  public async removeOne(id: string): Promise<FilmGenreEntity> {
    const entityToDelete = await this.findOneById(id);
    return this.filmGenresRepository.removeOne(entityToDelete).catch(() => {
      throw new NotFoundException(ErrorMessageEnum.FILM_GENRE_NOT_FOUND);
    });
  }
}
