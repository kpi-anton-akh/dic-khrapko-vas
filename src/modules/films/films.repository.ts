import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmEntity } from './entities';
import { IFilmsRepository } from './interfaces';
import { IFindConditions } from 'src/common/interfaces';

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    public readonly filmEntityRepository: Repository<FilmEntity>,
  ) {}

  public async createOne(entity: Partial<FilmEntity>): Promise<FilmEntity> {
    const entityToSave = this.filmEntityRepository.create(entity);
    return this.filmEntityRepository.save(entityToSave);
  }

  public async findAll(): Promise<FilmEntity[]> {
    return this.filmEntityRepository.find();
  }

  public async findOne(
    conditions: IFindConditions<FilmEntity>,
  ): Promise<FilmEntity> {
    return this.filmEntityRepository.findOne({
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
