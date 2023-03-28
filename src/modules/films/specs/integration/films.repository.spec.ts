import { Test, TestingModule } from '@nestjs/testing';
import { FilmEntity } from '../../entities';
import { FilmsRepository } from '../../films.repository';
import { FilmGenreEnum } from '../../enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../../../systems/database';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../common/enums';
import { FindManyOptions } from 'typeorm';

describe('FilmsRepository integration tests', () => {
  let repository: FilmsRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([FilmEntity]),
        ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
        DatabaseModule,
      ],
      providers: [FilmsRepository],
    }).compile();

    repository = module.get<FilmsRepository>(FilmsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const filmToCreate = {
        id: '25afea03-b5ef-45f4-a762-63e158dfb4d3',
        name: 'Test repository film name 1',
        genre: FilmGenreEnum.ACTION,
        rating: 5,
        releaseYear: 2011,
      } as FilmEntity;

      const received = await repository.createOne(filmToCreate);

      expect(received).toBeInstanceOf(FilmEntity);
      expect(received.id).toBe(filmToCreate.id);
      expect(received.name).toBe(filmToCreate.name);
      expect(received.genre).toBe(filmToCreate.genre);
      expect(received.rating).toBe(filmToCreate.rating);
      expect(received.releaseYear).toBe(filmToCreate.releaseYear);
      expect(received.authorsNamesInfo).toBe(null);
      expect(received.description).toBe(null);
    });

    it('should return an Bad Request error with "Invalid data" message', async () => {
      const filmToCreate = {
        id: '3a96e319-387c-4a50-b2ec-f3f515a39bf8',
        name: 'Test repository film name 2',
        genre: null,
      } as FilmEntity;
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => repository.createOne(filmToCreate)).rejects.toThrow(
        error,
      );
      await expect(() => repository.createOne(filmToCreate)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const filmToCreate1 = {
        id: '3e1f9bc1-ebb6-4c40-a94a-1d657f46579b',
        name: 'Test repository film name 3',
        genre: FilmGenreEnum.COMEDY,
        rating: 5,
        releaseYear: 1913,
      } as FilmEntity;
      const filmToCreate2 = {
        id: '00376628-9170-4633-8d87-280b7d95cf93',
        name: 'Test repository film name 4',
        genre: FilmGenreEnum.OTHER,
        rating: 5,
        releaseYear: 1995,
      } as FilmEntity;
      await repository.createOne(filmToCreate1);
      await repository.createOne(filmToCreate2);

      const received = await repository.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received.length).toBeGreaterThanOrEqual(2);
      for (const entity of received) {
        expect(entity).toBeInstanceOf(FilmEntity);
      }
    });

    it('should return Not Found Exception, if specified invalid options', async () => {
      const options: FindManyOptions<FilmEntity> = { take: -1 };
      const error = new NotFoundException(ErrorMessageEnum.FILMS_NOT_FOUND);

      await expect(() => repository.findAll(options)).rejects.toThrow(error);
      await expect(() => repository.findAll(options)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return array of found FilmEntities', async () => {
      const filmToCreate = {
        id: '48154fd2-de80-4ab8-8e04-ab63c09adfac',
        name: 'Test repository film name 5',
        genre: FilmGenreEnum.DRAMA,
        rating: 7.32,
        releaseYear: 2022,
      } as FilmEntity;
      await repository.createOne(filmToCreate);

      const received = await repository.findOne({ id: filmToCreate.id });

      expect(received).toBeInstanceOf(FilmEntity);
      expect(received.id).toBe(filmToCreate.id);
      expect(received.name).toBe(filmToCreate.name);
      expect(received.genre).toBe(filmToCreate.genre);
    });

    it('should return Not Found exception', async () => {
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

      await expect(() => repository.findOne({ id: '' })).rejects.toThrow(error);
      await expect(() => repository.findOne({ id: '' })).rejects.toThrow(
        NotFoundException,
      );
    });

    describe('updateOne', () => {
      it('should return updated FilmEntity', async () => {
        const filmToCreate = {
          id: '739e0c90-f56f-4809-93b2-4ca461347d79',
          name: 'Test repository film name 6',
          genre: FilmGenreEnum.ACTION,
          description: 'description',
          rating: 4.74,
          releaseYear: 1990,
        } as FilmEntity;
        await repository.createOne(filmToCreate);

        const received = await repository.updateOne(
          { id: filmToCreate.id },
          { description: 'New description' },
        );

        expect(received).toBeInstanceOf(FilmEntity);
        expect(received.id).toBe(filmToCreate.id);
        expect(received.description).not.toBe(filmToCreate.description);
        expect(received.description).toBe('New description');
      });

      it('should return Invalid data error when trying to update an entity to an invalid one', async () => {
        const filmToCreate = {
          id: '8c0d09a6-0a25-404c-a8ba-32fcf81b01c7',
          name: 'Test repository film name 7',
          genre: FilmGenreEnum.ACTION,
          description: 'description',
          rating: 4.74,
          releaseYear: 1990,
        } as FilmEntity;
        await repository.createOne(filmToCreate);
        const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

        await expect(() =>
          repository.updateOne({ id: filmToCreate.id }, { genre: null }),
        ).rejects.toThrow(error);
        await expect(() =>
          repository.updateOne({ id: filmToCreate.id }, { genre: null }),
        ).rejects.toThrow(BadRequestException);
      });

      it('should return Not Found exception when no entity was found to update', async () => {
        const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

        await expect(() =>
          repository.updateOne({ id: '' }, {}),
        ).rejects.toThrow(error);
        await expect(() =>
          repository.updateOne({ id: '' }, {}),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('removeOne', () => {
      it('should return removed FilmEntity', async () => {
        const filmToCreate = {
          id: '7efd5ac2-f68e-4004-826c-b1d900f7a126',
          name: 'Test repository film name 8',
          genre: FilmGenreEnum.ACTION,
          description: 'description',
          rating: 4.74,
          releaseYear: 1990,
        } as FilmEntity;
        await repository.createOne(filmToCreate);

        const received = await repository.removeOne({ id: filmToCreate.id });

        expect(received).toBeInstanceOf(FilmEntity);
        expect(received.id).toBe(undefined);
        expect(received.name).toBe(filmToCreate.name);
        expect(received.genre).toBe(filmToCreate.genre);
        expect(received.name).toBe(filmToCreate.name);
        expect(received.description).toBe(filmToCreate.description);
      });

      it('should return Not Found exception when no entity was found to remove', async () => {
        const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

        await expect(() => repository.removeOne({ id: '' })).rejects.toThrow(
          error,
        );
        await expect(() => repository.removeOne({ id: '' })).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
