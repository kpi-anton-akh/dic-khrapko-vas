import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmEntity } from '../../entities';
import { FilmsRepository } from '../../films.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FilmsRepository unit tests', () => {
  let repository: FilmsRepository;

  const filmEntity = new FilmEntity();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsRepository,
        // Mocking FilmsEntityRepository provider
        {
          provide: getRepositoryToken(FilmEntity),
          useValue: {
            create: (entity: Partial<FilmEntity>) =>
              plainToInstance(FilmEntity, { ...entity, ...filmEntity }),
            save: async (entity: Partial<FilmEntity>) =>
              plainToInstance(FilmEntity, { ...entity, ...filmEntity }),
            find: async () => [filmEntity],
            findOne: async () => filmEntity,
            merge: (
              entityToUpdate: Partial<FilmEntity>,
              entity: Partial<FilmEntity>,
            ) =>
              plainToInstance(FilmEntity, {
                ...entityToUpdate,
                ...filmEntity,
                ...entity,
              }),
            remove: async () => new FilmEntity(),
          },
        },
      ],
    }).compile();

    repository = module.get<FilmsRepository>(FilmsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const received = await repository.createOne(filmEntity);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const received = await repository.findAll();
      expect(Array.isArray(received)).toBe(true);
      for (const entity of received) {
        expect(entity).toBeInstanceOf(FilmEntity);
      }
    });
  });

  describe('findOne', () => {
    it('should return found FilmEntity', async () => {
      const received = await repository.findOne({ ...filmEntity });
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmEntity', async () => {
      const received = await repository.updateOne(
        { ...filmEntity },
        { name: 'new name' },
      );
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmEntity', async () => {
      const received = await repository.removeOne({ ...filmEntity });
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });
});
