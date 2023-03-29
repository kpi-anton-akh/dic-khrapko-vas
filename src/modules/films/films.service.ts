import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { FilmsRepository } from './films.repository';
import { FilmEntity } from './entities';
import { ErrorMessageEnum } from 'src/common/enums';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  public async createOne(entity: Partial<FilmEntity>): Promise<FilmEntity> {
    return this.filmsRepository.createOne(entity).catch(() => {
      throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
    });
  }

  public async findAll(
    options: FindManyOptions<FilmEntity> = { loadEagerRelations: true },
  ): Promise<FilmEntity[]> {
    return this.filmsRepository.findAll(options).catch(() => {
      throw new NotFoundException(ErrorMessageEnum.FILMS_NOT_FOUND);
    });
  }

  public async findOne(
    conditions: FindOptionsWhere<FilmEntity>,
    options: FindOneOptions<FilmEntity> = { loadEagerRelations: true },
  ): Promise<FilmEntity> {
    return this.filmsRepository
      .findOne(conditions, options)
      .then((entity) => {
        if (entity) return entity;
        throw new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);
      })
      .catch(() => {
        throw new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);
      });
  }

  public async updateOne(
    conditions: FindOptionsWhere<FilmEntity>,
    entity: Partial<FilmEntity>,
  ): Promise<FilmEntity> {
    const entityToUpdate = await this.findOne(conditions);
    const { id } = await this.filmsRepository
      .updateOne(entityToUpdate, entity)
      .catch(() => {
        throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
      });

    return this.findOne({ id }, { loadEagerRelations: true });
  }

  public async removeOne(
    conditions: FindOptionsWhere<FilmEntity>,
  ): Promise<FilmEntity> {
    const entityToDelete = await this.findOne(conditions);
    return this.filmsRepository.removeOne(entityToDelete).catch(() => {
      throw new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);
    });
  }
}
