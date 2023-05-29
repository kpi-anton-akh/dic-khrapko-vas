import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { GenresRepository } from './genres.repository';
import { GenreEntity } from './genre.entity';
import { ErrorMessageEnum } from 'src/common/enums';

@Injectable()
export class GenresService {
  constructor(private readonly genresRepository: GenresRepository) {}

  public async createOne(entity: Partial<GenreEntity>): Promise<GenreEntity> {
    return this.genresRepository.createOne(entity).catch(() => {
      throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
    });
  }

  public async findAll(): Promise<GenreEntity[]> {
    return this.genresRepository.findAll().catch(() => {
      throw new NotFoundException(ErrorMessageEnum.GENRES_NOT_FOUND);
    });
  }

  public async findOneById(id: string): Promise<GenreEntity> {
    return this.genresRepository
      .findOneById(id)
      .then((entity) => {
        if (entity) return entity;
        throw new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);
      })
      .catch(() => {
        throw new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);
      });
  }

  public async updateOne(
    id: string,
    entity: Partial<GenreEntity>,
  ): Promise<GenreEntity> {
    const entityToUpdate = await this.findOneById(id);
    const { id: entityId } = await this.genresRepository
      .updateOne(entityToUpdate, entity)
      .catch(() => {
        throw new BadRequestException(ErrorMessageEnum.INVALID_DATA);
      });

    return this.findOneById(entityId);
  }

  public async removeOne(id: string): Promise<GenreEntity> {
    const entityToDelete = await this.findOneById(id);
    return this.genresRepository.removeOne(entityToDelete).catch(() => {
      throw new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);
    });
  }
}
