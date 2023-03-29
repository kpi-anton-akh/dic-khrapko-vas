import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FilmEntity } from './entities';
import { IRepository } from 'src/common/interfaces';

@Injectable()
export class FilmsRepository implements IRepository<FilmEntity> {
  constructor(
    @InjectRepository(FilmEntity)
    public readonly filmEntityRepository: Repository<FilmEntity>,
  ) {}

  public async createOne(entity: Partial<FilmEntity>): Promise<FilmEntity> {
    const entityToSave = this.filmEntityRepository.create(entity);
    return this.filmEntityRepository.save(entityToSave);
  }

  public async findAll(
    options: FindManyOptions<FilmEntity> = { loadEagerRelations: false },
  ): Promise<FilmEntity[]> {
    return this.filmEntityRepository.find(options);
  }

  public async findOne(
    conditions: FindOptionsWhere<FilmEntity>,
    options: FindOneOptions<FilmEntity> = { loadEagerRelations: false },
  ): Promise<FilmEntity> {
    return this.filmEntityRepository.findOne({
      ...options,
      where: conditions,
    });
  }

  public async updateOne(
    entityToUpdate: FilmEntity,
    entity: Partial<FilmEntity>,
  ): Promise<FilmEntity> {
    const updatedEntity = this.filmEntityRepository.merge(
      entityToUpdate,
      entity,
    );
    return this.filmEntityRepository.save(updatedEntity);
  }

  public async removeOne(entity: FilmEntity): Promise<FilmEntity> {
    return this.filmEntityRepository.remove(entity);
  }
}
