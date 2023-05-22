import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreEntity } from './genre.entity';
import { IGenresRepository } from './interfaces';
import { plainToInstance } from 'class-transformer';
import { TYPEORM_CONNECTION_NAME_NOSQL } from 'src/config/app-config.service';
import { ObjectID } from 'mongodb';

@Injectable()
export class GenresRepository implements IGenresRepository {
  constructor(
    @InjectRepository(GenreEntity, TYPEORM_CONNECTION_NAME_NOSQL)
    public readonly genreEntityRepository: Repository<GenreEntity>,
  ) {}

  public async createOne(entity: Partial<GenreEntity>): Promise<GenreEntity> {
    const entityToSave = this.genreEntityRepository.create(entity);
    const createdEntity = await this.genreEntityRepository.save(entityToSave);

    return plainToInstance(GenreEntity, createdEntity);
  }

  public async findAll(): Promise<GenreEntity[]> {
    const entities: GenreEntity[] = await this.genreEntityRepository.find();

    return plainToInstance(GenreEntity, entities);
  }

  public async findOneById(id: string): Promise<GenreEntity> {
    const entity = await this.genreEntityRepository.findOne(new ObjectID(id));

    return plainToInstance(GenreEntity, entity);
  }

  public async updateOne(
    entityToUpdate: GenreEntity,
    entity: Partial<GenreEntity>,
  ): Promise<GenreEntity> {
    const updatedEntity = this.genreEntityRepository.merge(
      { ...entityToUpdate, id: new ObjectID(entityToUpdate.id) },
      entity,
    );
    const savedEntity = await this.genreEntityRepository.save(updatedEntity);

    return plainToInstance(GenreEntity, savedEntity);
  }

  public async removeOne(entity: GenreEntity): Promise<GenreEntity> {
    const removedEntity = await this.genreEntityRepository.remove(entity);

    return plainToInstance(GenreEntity, removedEntity);
  }
}
