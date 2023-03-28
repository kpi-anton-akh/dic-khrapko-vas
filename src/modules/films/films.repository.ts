import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessageEnum } from '../../common/enums';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FilmEntity } from './entities';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    public readonly filmEntityRepository: Repository<FilmEntity>,
  ) {}

  public async createOne(entity: Partial<FilmEntity>): Promise<FilmEntity> {
    const entityToSave = this.filmEntityRepository.create(entity);
    return this.filmEntityRepository.save(entityToSave).catch(() => {
      throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
    });
  }

  public async findAll(
    options: FindManyOptions<FilmEntity> = { loadEagerRelations: false },
  ): Promise<FilmEntity[]> {
    return this.filmEntityRepository.find(options).catch(() => {
      throw new NotFoundException(ErrorMessageEnum.FILMS_NOT_FOUND);
    });
  }

  public async findOne(
    conditions: FindOptionsWhere<FilmEntity>,
    options: FindOneOptions<FilmEntity> = { loadEagerRelations: false },
  ): Promise<FilmEntity> {
    return this.filmEntityRepository
      .findOne({
        ...options,
        where: conditions,
      })
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
    const updatedEntity = this.filmEntityRepository.merge(
      entityToUpdate,
      entity,
    );
    const { id } = await this.filmEntityRepository
      .save(updatedEntity)
      .catch(() => {
        throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
      });

    return this.findOne({ id }, { loadEagerRelations: true });
  }

  public async removeOne(
    conditions: FindOptionsWhere<FilmEntity>,
  ): Promise<FilmEntity> {
    const entityToDelete = await this.findOne(conditions);
    return this.filmEntityRepository.remove(entityToDelete).catch(() => {
      throw new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);
    });
  }
}
