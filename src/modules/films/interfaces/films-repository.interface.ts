import { IFindConditions } from 'src/common/interfaces';
import { FilmEntity } from '../entities';

export interface IFilmsRepository {
  createOne(entity: Partial<FilmEntity>): Promise<FilmEntity>;
  findAll(): Promise<FilmEntity[]>;
  findOne(conditions: IFindConditions<FilmEntity>): Promise<FilmEntity>;
  updateOne(
    entityToUpdate: FilmEntity,
    entity: Partial<FilmEntity>,
  ): Promise<FilmEntity>;
  removeOne(entity: FilmEntity): Promise<FilmEntity>;
}
