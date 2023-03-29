import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

export interface IRepository<Entity> {
  createOne(entity: Partial<Entity>): Promise<Entity>;
  findAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findOne(
    conditions: FindOptionsWhere<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity>;
  updateOne(
    conditions: FindOptionsWhere<Entity>,
    entity: Partial<Entity>,
  ): Promise<Entity>;
  removeOne(conditions: FindOptionsWhere<Entity>): Promise<Entity>;
}
