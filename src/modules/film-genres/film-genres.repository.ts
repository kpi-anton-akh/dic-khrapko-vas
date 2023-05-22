import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmGenreEntity } from './film-genre.entity';
import { IFilmGenresRepository } from './interfaces';
import { plainToInstance } from 'class-transformer';
import { TYPEORM_CONNECTION_NAME_NOSQL } from 'src/config/app-config.service';
import { ObjectID } from 'mongodb';

@Injectable()
export class FilmGenresRepository implements IFilmGenresRepository {
  constructor(
    @InjectRepository(FilmGenreEntity, TYPEORM_CONNECTION_NAME_NOSQL)
    public readonly filmGenreEntityRepository: Repository<FilmGenreEntity>,
  ) {}

  public async createOne(
    entity: Partial<FilmGenreEntity>,
  ): Promise<FilmGenreEntity> {
    const entityToSave = this.filmGenreEntityRepository.create(entity);
    const createdEntity = await this.filmGenreEntityRepository.save(
      entityToSave,
    );

    return plainToInstance(FilmGenreEntity, createdEntity);
  }

  public async findAll(): Promise<FilmGenreEntity[]> {
    const entities: FilmGenreEntity[] =
      await this.filmGenreEntityRepository.find();

    return plainToInstance(FilmGenreEntity, entities);
  }

  public async findOneById(id: string): Promise<FilmGenreEntity> {
    const entity = await this.filmGenreEntityRepository.findOne(
      new ObjectID(id),
    );

    return plainToInstance(FilmGenreEntity, entity);
  }

  public async updateOne(
    entityToUpdate: FilmGenreEntity,
    entity: Partial<FilmGenreEntity>,
  ): Promise<FilmGenreEntity> {
    const updatedEntity = this.filmGenreEntityRepository.merge(
      { ...entityToUpdate, id: new ObjectID(entityToUpdate.id) },
      entity,
    );
    const savedEntity = await this.filmGenreEntityRepository.save(
      updatedEntity,
    );

    return plainToInstance(FilmGenreEntity, savedEntity);
  }

  public async removeOne(entity: FilmGenreEntity): Promise<FilmGenreEntity> {
    const removedEntity = await this.filmGenreEntityRepository.remove(entity);

    return plainToInstance(FilmGenreEntity, removedEntity);
  }
}
