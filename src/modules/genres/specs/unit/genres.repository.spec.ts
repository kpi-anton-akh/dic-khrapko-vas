import { Test, TestingModule } from '@nestjs/testing';
import { GenresRepository } from '../../genres.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenreEntity } from '../../genre.entity';
import { TYPEORM_CONNECTION_NAME_NOSQL } from 'src/config/app-config.service';

describe('GenresRepository unit tests', () => {
  let repository: GenresRepository;

  const genreEntity = {
    id: '645eada892807112c366fb94',
    name: 'film genres repository test entity name',
    desciption: 'film genres repository test entity description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as GenreEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresRepository,
        // Mocking GenresRepository provider
        {
          provide: getRepositoryToken(
            GenreEntity,
            TYPEORM_CONNECTION_NAME_NOSQL,
          ),
          useValue: {
            create: () => genreEntity,
            save: async () => genreEntity,
            find: async () => [genreEntity],
            findOne: async () => genreEntity,
            merge: () => genreEntity,
            remove: async () => new GenreEntity(),
          },
        },
      ],
    }).compile();

    repository = module.get<GenresRepository>(GenresRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created GenreEntity', async () => {
      const received = await repository.createOne(genreEntity);

      expect(received).toEqual(genreEntity);
      expect(received).toBeInstanceOf(GenreEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found GenreEntities', async () => {
      const expected = [genreEntity];

      const received = await repository.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });
  });

  describe('findOneById', () => {
    it('should return found GenreEntity', async () => {
      const received = await repository.findOneById(genreEntity.id);

      expect(received).toEqual(genreEntity);
      expect(received).toBeInstanceOf(GenreEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated GenreEntity', async () => {
      const received = await repository.updateOne(genreEntity, {});

      expect(received).toEqual(genreEntity);
      expect(received).toBeInstanceOf(GenreEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed GenreEntity', async () => {
      const received = await repository.removeOne(genreEntity);

      expect(received).toBeInstanceOf(GenreEntity);
    });
  });
});
