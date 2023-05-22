import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresService } from '../../film-genres.service';
import { FilmGenresRepository } from '../../film-genres.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/common/enums';
import { FilmGenreEntity } from '../../film-genre.entity';

describe('FilmGenresService unit tests', () => {
  let repository: FilmGenresRepository;
  let service: FilmGenresService;

  const filmGenreEntity = {
    id: '645f3cd9c1635ae1fe9c92e4',
    name: 'film genres service test entity name',
    desciption: 'film genres service test entity description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FilmGenreEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmGenresService,
        // Mocking FilmGenresRepository provider
        {
          provide: FilmGenresRepository,
          useValue: {
            createOne: async () => filmGenreEntity,
            findAll: async () => [filmGenreEntity],
            findOneById: async () => filmGenreEntity,
            updateOne: async () => filmGenreEntity,
            removeOne: async () => new FilmGenreEntity(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmGenresService>(FilmGenresService);
    repository = module.get<FilmGenresRepository>(FilmGenresRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmGenreEntity', async () => {
      const received = await service.createOne(filmGenreEntity);

      expect(received).toEqual(filmGenreEntity);
    });

    it('should throw BadRequestException if an error occurs when repository creates new entity', async () => {
      jest.spyOn(repository, 'createOne').mockRejectedValue(new Error());
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => service.createOne(filmGenreEntity)).rejects.toThrow(
        error,
      );
      await expect(() => service.createOne(filmGenreEntity)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmGenreEntities', async () => {
      const expected = [filmGenreEntity];

      const received = await service.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });

    it('should throw NotFoundException if an error occurs when repository find all entities', async () => {
      jest.spyOn(repository, 'findAll').mockRejectedValue(new Error());
      const error = new NotFoundException(
        ErrorMessageEnum.FILM_GENRES_NOT_FOUND,
      );

      await expect(() => service.findAll()).rejects.toThrow(error);
      await expect(() => service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return found FilmGenreEntity', async () => {
      const received = await service.findOneById(filmGenreEntity.id);

      expect(received).toEqual(filmGenreEntity);
    });

    it('should throw NotFoundException if repository find one entity by id returns null value (entity not found in database)', async () => {
      jest.spyOn(repository, 'findOneById').mockResolvedValue(null);
      const error = new NotFoundException(
        ErrorMessageEnum.FILM_GENRE_NOT_FOUND,
      );

      await expect(() =>
        service.findOneById(filmGenreEntity.id),
      ).rejects.toThrow(error);
      await expect(() =>
        service.findOneById(filmGenreEntity.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if an error occurs when repository find one entity', async () => {
      jest.spyOn(repository, 'findOneById').mockRejectedValue(new Error());
      const error = new NotFoundException(
        ErrorMessageEnum.FILM_GENRE_NOT_FOUND,
      );

      await expect(() =>
        service.findOneById(filmGenreEntity.id),
      ).rejects.toThrow(error);
      await expect(() =>
        service.findOneById(filmGenreEntity.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmGenreEntity', async () => {
      const received = await service.updateOne(filmGenreEntity.id, {});

      expect(received).toEqual(filmGenreEntity);
    });

    it('should throw NotFoundException if entity to update not found in database', async () => {
      const error = new NotFoundException(
        ErrorMessageEnum.FILM_GENRE_NOT_FOUND,
      );
      jest.spyOn(service, 'findOneById').mockRejectedValue(error);

      await expect(() =>
        service.updateOne(filmGenreEntity.id, {}),
      ).rejects.toThrow(error);
      await expect(() =>
        service.updateOne(filmGenreEntity.id, {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if an error occurs when repository updates entity', async () => {
      jest.spyOn(repository, 'updateOne').mockRejectedValue(new Error());
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() =>
        service.updateOne(filmGenreEntity.id, {}),
      ).rejects.toThrow(error);
      await expect(() =>
        service.updateOne(filmGenreEntity.id, {}),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmGenreEntity', async () => {
      const received = await service.removeOne(filmGenreEntity.id);

      expect(received).toBeInstanceOf(FilmGenreEntity);
    });

    it('should throw NotFoundException if entity to remove not found in database', async () => {
      const error = new NotFoundException(
        ErrorMessageEnum.FILM_GENRE_NOT_FOUND,
      );
      jest.spyOn(service, 'findOneById').mockRejectedValue(error);

      await expect(() => service.removeOne(filmGenreEntity.id)).rejects.toThrow(
        error,
      );
      await expect(() => service.removeOne(filmGenreEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if an error occurs when repository removes entity', async () => {
      jest.spyOn(repository, 'removeOne').mockRejectedValue(new Error());
      const error = new NotFoundException(
        ErrorMessageEnum.FILM_GENRE_NOT_FOUND,
      );

      await expect(() => service.removeOne(filmGenreEntity.id)).rejects.toThrow(
        error,
      );
      await expect(() => service.removeOne(filmGenreEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
