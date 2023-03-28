import { Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { FilmsRepository } from './films.repository';
import { FilmEntity } from './entities';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  public async createOne(entity: Partial<FilmEntity>): Promise<FilmEntity> {
    return this.filmsRepository.createOne(entity);
  }

  public async findAll(
    options: FindManyOptions<FilmEntity> = { loadEagerRelations: true },
  ): Promise<FilmEntity[]> {
    return this.filmsRepository.findAll(options);
  }

  public async findOne(
    conditions: FindOptionsWhere<FilmEntity>,
    options: FindOneOptions<FilmEntity> = { loadEagerRelations: true },
  ): Promise<FilmEntity> {
    return this.filmsRepository.findOne(conditions, options);
  }

  public async updateOne(
    conditions: FindOptionsWhere<FilmEntity>,
    entity: Partial<FilmEntity>,
  ): Promise<FilmEntity> {
    return this.filmsRepository.updateOne(conditions, entity);
  }

  public async removeOne(
    conditions: FindOptionsWhere<FilmEntity>,
  ): Promise<FilmEntity> {
    return this.filmsRepository.removeOne(conditions);
  }
}
