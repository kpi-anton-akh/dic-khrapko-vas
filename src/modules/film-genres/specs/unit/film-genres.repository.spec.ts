import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresRepository } from '../../film-genres.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FilmGenreEntity } from '../../film-genre.entity';
import { TYPEORM_CONNECTION_NAME_NOSQL } from 'src/config/app-config.service';

describe('FilmGenresRepository unit tests', () => {
  let repository: FilmGenresRepository;

  const filmGenreEntity = {
    id: '645eada892807112c366fb94',
    name: 'film genres repository test entity name',
    desciption: 'film genres repository test entity description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FilmGenreEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmGenresRepository,
        // Mocking FilmGenresEntityRepository provider
        {
          provide: getRepositoryToken(
            FilmGenreEntity,
            TYPEORM_CONNECTION_NAME_NOSQL,
          ),
          useValue: {
            create: () => filmGenreEntity,
            save: async () => filmGenreEntity,
            find: async () => [filmGenreEntity],
            findOne: async () => filmGenreEntity,
            merge: () => filmGenreEntity,
            remove: async () => new FilmGenreEntity(),
          },
        },
      ],
    }).compile();

    repository = module.get<FilmGenresRepository>(FilmGenresRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmGenreEntity', async () => {
      const received = await repository.createOne(filmGenreEntity);

      expect(received).toEqual(filmGenreEntity);
      expect(received).toBeInstanceOf(FilmGenreEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmGenreEntities', async () => {
      const expected = [filmGenreEntity];

      const received = await repository.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });
  });

  describe('findOneById', () => {
    it('should return found FilmGenreEntity', async () => {
      const received = await repository.findOneById(filmGenreEntity.id);

      expect(received).toEqual(filmGenreEntity);
      expect(received).toBeInstanceOf(FilmGenreEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmGenreEntity', async () => {
      const received = await repository.updateOne(filmGenreEntity, {});

      expect(received).toEqual(filmGenreEntity);
      expect(received).toBeInstanceOf(FilmGenreEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmGenreEntity', async () => {
      const received = await repository.removeOne(filmGenreEntity);

      expect(received).toBeInstanceOf(FilmGenreEntity);
    });
  });
});
