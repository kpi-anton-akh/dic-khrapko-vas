import { GenreEntity } from '../genre.entity';

export interface IGenresRepository {
  createOne(entity: Partial<GenreEntity>): Promise<GenreEntity>;
  findAll(): Promise<GenreEntity[]>;
  findOneById(id: string): Promise<GenreEntity>;
  updateOne(
    entityToUpdate: GenreEntity,
    entity: Partial<GenreEntity>,
  ): Promise<GenreEntity>;
  removeOne(entity: GenreEntity): Promise<GenreEntity>;
}
