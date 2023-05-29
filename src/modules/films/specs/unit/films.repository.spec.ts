import { Test, TestingModule } from '@nestjs/testing';
import { FilmEntity } from '../../entities';
import { FilmsRepository } from '../../films.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION_NAME } from 'src/config/app-config.service';

describe('FilmsRepository unit tests', () => {
  let repository: FilmsRepository;

  const filmEntity = {
    id: '7e8c4c29-cd12-44b7-84aa-02f3e721f706',
    name: 'films repository test entity',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FilmEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsRepository,
        // Mocking FilmsEntityRepository provider
        {
          provide: getRepositoryToken(FilmEntity, TYPEORM_CONNECTION_NAME),
          useValue: {
            create: () => filmEntity,
            save: async () => filmEntity,
            find: async () => [filmEntity],
            findOne: async () => filmEntity,
            merge: () => filmEntity,
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

      expect(received).toEqual(filmEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const expected = [filmEntity];

      const received = await repository.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return found FilmEntity', async () => {
      const received = await repository.findOne(filmEntity);

      expect(received).toEqual(filmEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmEntity', async () => {
      const received = await repository.updateOne(filmEntity, {});

      expect(received).toEqual(filmEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmEntity', async () => {
      const received = await repository.removeOne(filmEntity);

      expect(received).toBeInstanceOf(FilmEntity);
    });
  });
});
