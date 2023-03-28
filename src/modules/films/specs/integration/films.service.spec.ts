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
import { FilmsService } from '../../films.service';

describe('FilmsService integration tests', () => {
  let service: FilmsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([FilmEntity]),
        ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
        DatabaseModule,
      ],
      providers: [FilmsService, FilmsRepository],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const filmToCreate = {
        id: '16ad915a-1ea8-4235-9cd8-aaab8a684350',
        name: 'Test service film name 1',
        genre: FilmGenreEnum.ACTION,
        rating: 5,
        releaseYear: 2011,
      } as FilmEntity;

      const received = await service.createOne(filmToCreate);

      expect(received).toBeInstanceOf(FilmEntity);
      expect(received.id).toBe(filmToCreate.id);
      expect(received.name).toBe(filmToCreate.name);
      expect(received.genre).toBe(filmToCreate.genre);
      expect(received.rating).toBe(filmToCreate.rating);
      expect(received.releaseYear).toBe(filmToCreate.releaseYear);
      expect(received.authorsNamesInfo).toBe(null);
      expect(received.description).toBe(null);
    });

    it('should return Bad Request error with "Invalid data" message', async () => {
      const filmToCreate = {
        id: '118558e7-be4b-40d1-bc2b-d1e830da3f6b',
        name: 'Test service film name 2',
        genre: null,
      } as FilmEntity;
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => service.createOne(filmToCreate)).rejects.toThrow(
        error,
      );
      await expect(() => service.createOne(filmToCreate)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const filmToCreate1 = {
        id: '87632fed-1bf3-4754-a237-8dd30a8ec492',
        name: 'Test service film name 3',
        genre: FilmGenreEnum.COMEDY,
        rating: 5,
        releaseYear: 1913,
      } as FilmEntity;
      const filmToCreate2 = {
        id: 'c9b46414-7810-4636-9a59-843d03a72713',
        name: 'Test service film name 4',
        genre: FilmGenreEnum.OTHER,
        rating: 5,
        releaseYear: 1995,
      } as FilmEntity;
      await service.createOne(filmToCreate1);
      await service.createOne(filmToCreate2);

      const received = await service.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received.length).toBeGreaterThanOrEqual(2);
      for (const entity of received) {
        expect(entity).toBeInstanceOf(FilmEntity);
      }
    });

    it('should return Not Found Exception, if specified invalid options', async () => {
      const options: FindManyOptions<FilmEntity> = { take: -1 };
      const error = new NotFoundException(ErrorMessageEnum.FILMS_NOT_FOUND);

      await expect(() => service.findAll(options)).rejects.toThrow(error);
      await expect(() => service.findAll(options)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return array of found FilmEntities', async () => {
      const filmToCreate = {
        id: '4a821723-0d16-423a-9dc4-d77ab105203b',
        name: 'Test service film name 5',
        genre: FilmGenreEnum.DRAMA,
        rating: 7.32,
        releaseYear: 2022,
      } as FilmEntity;
      await service.createOne(filmToCreate);

      const received = await service.findOne({ id: filmToCreate.id });

      expect(received).toBeInstanceOf(FilmEntity);
      expect(received.id).toBe(filmToCreate.id);
      expect(received.name).toBe(filmToCreate.name);
      expect(received.genre).toBe(filmToCreate.genre);
    });

    it('should return Not Found exception', async () => {
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

      await expect(() => service.findOne({ id: '' })).rejects.toThrow(error);
      await expect(() => service.findOne({ id: '' })).rejects.toThrow(
        NotFoundException,
      );
    });

    describe('updateOne', () => {
      it('should return updated FilmEntity', async () => {
        const filmToCreate = {
          id: 'e2aeb976-3c46-4964-be2a-35347c287edc',
          name: 'Test service film name 6',
          genre: FilmGenreEnum.ACTION,
          description: 'description',
          rating: 4.74,
          releaseYear: 1990,
        } as FilmEntity;
        await service.createOne(filmToCreate);

        const received = await service.updateOne(
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
          id: 'b9fea74e-5caa-4748-9373-8a37c532eb05',
          name: 'Test service film name 7',
          genre: FilmGenreEnum.ACTION,
          description: 'description',
          rating: 4.74,
          releaseYear: 1990,
        } as FilmEntity;
        await service.createOne(filmToCreate);
        const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

        await expect(() =>
          service.updateOne({ id: filmToCreate.id }, { genre: null }),
        ).rejects.toThrow(error);
        await expect(() =>
          service.updateOne({ id: filmToCreate.id }, { genre: null }),
        ).rejects.toThrow(BadRequestException);
      });

      it('should return Not Found exception when no entity was found to update', async () => {
        const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

        await expect(() => service.updateOne({ id: '' }, {})).rejects.toThrow(
          error,
        );
        await expect(() => service.updateOne({ id: '' }, {})).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('removeOne', () => {
      it('should return removed FilmEntity', async () => {
        const filmToCreate = {
          id: 'a896b556-90c9-46e3-aef3-920046313e4b',
          name: 'Test service film name 8',
          genre: FilmGenreEnum.ACTION,
          description: 'description',
          rating: 4.74,
          releaseYear: 1990,
        } as FilmEntity;
        await service.createOne(filmToCreate);

        const received = await service.removeOne({ id: filmToCreate.id });

        expect(received).toBeInstanceOf(FilmEntity);
        expect(received.id).toBe(undefined);
        expect(received.name).toBe(filmToCreate.name);
        expect(received.genre).toBe(filmToCreate.genre);
        expect(received.name).toBe(filmToCreate.name);
        expect(received.description).toBe(filmToCreate.description);
      });

      it('should return Not Found exception when no entity was found to remove', async () => {
        const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

        await expect(() => service.removeOne({ id: '' })).rejects.toThrow(
          error,
        );
        await expect(() => service.removeOne({ id: '' })).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
