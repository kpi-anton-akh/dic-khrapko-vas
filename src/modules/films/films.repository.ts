import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmEntity } from './entities';
import { IFilmsRepository } from './interfaces';
import { IFindConditions } from 'src/common/interfaces';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    public readonly filmEntityRepository: Repository<FilmEntity>,
  ) {}

  public async createOne(entity: Partial<FilmEntity>): Promise<FilmEntity> {
    const entityToSave = this.filmEntityRepository.create(entity);
    const createdEntity = await this.filmEntityRepository.save(entityToSave);

    return plainToInstance(FilmEntity, createdEntity);
  }

  public async findAll(): Promise<FilmEntity[]> {
    const entities: FilmEntity[] = await this.filmEntityRepository.find();

    return plainToInstance(FilmEntity, entities);
  }

  public async findOne(
    conditions: IFindConditions<FilmEntity>,
  ): Promise<FilmEntity> {
    const entity = await this.filmEntityRepository.findOne({
      where: conditions,
    });

    return plainToInstance(FilmEntity, entity);
  }

  public async updateOne(
    entityToUpdate: FilmEntity,
    entity: Partial<FilmEntity>,
  ): Promise<FilmEntity> {
    const updatedEntity = this.filmEntityRepository.merge(
      entityToUpdate,
      entity,
    );
    const savedEntity = await this.filmEntityRepository.save(updatedEntity);

    return plainToInstance(FilmEntity, savedEntity);
  }

  public async removeOne(entity: FilmEntity): Promise<FilmEntity> {
    const removedEntity = await this.filmEntityRepository.remove(entity);

    return plainToInstance(FilmEntity, removedEntity);
  }
}
