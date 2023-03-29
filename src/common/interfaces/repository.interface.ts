import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

export interface IRepository<Entity> {
  createOne(entity: Partial<Entity>): Promise<Entity>;
  findAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findOne(
    conditions: FindOptionsWhere<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity>;
  updateOne(entityToUpdate: Entity, entity: Partial<Entity>): Promise<Entity>;
  removeOne(entity: Entity): Promise<Entity>;
}
