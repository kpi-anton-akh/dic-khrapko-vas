import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from '../../films.service';
import { FilmEntity } from '../../entities';
import { FilmsRepository } from '../../films.repository';
import { FilmGenreEnum } from '../../enums';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/common/enums';

describe('FilmsService unit tests', () => {
  let repository: FilmsRepository;
  let service: FilmsService;

  const filmEntity = {
    id: '61b37c40-3f0b-4bee-8aae-5a03fdef9faa',
    name: 'films service test entity',
    genre: FilmGenreEnum.ACTION,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FilmEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        // Mocking FilmsRepository provider
        {
          provide: FilmsRepository,
          useValue: {
            createOne: async () => filmEntity,
            findAll: async () => [filmEntity],
            findOne: async () => filmEntity,
            updateOne: async () => filmEntity,
            removeOne: async () => new FilmEntity(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<FilmsRepository>(FilmsRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const received = await service.createOne(filmEntity);

      expect(received).toEqual(filmEntity);
    });

    it('should throw BadRequestException if an error occurs when repository creates new entity', async () => {
      jest.spyOn(repository, 'createOne').mockRejectedValue(new Error());
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => service.createOne(filmEntity)).rejects.toThrow(error);
      await expect(() => service.createOne(filmEntity)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const expected = [filmEntity];

      const received = await service.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });

    it('should throw NotFoundException if an error occurs when repository find all entities', async () => {
      jest.spyOn(repository, 'findAll').mockRejectedValue(new Error());
      const error = new NotFoundException(ErrorMessageEnum.FILMS_NOT_FOUND);

      await expect(() => service.findAll()).rejects.toThrow(error);
      await expect(() => service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return found FilmEntity', async () => {
      const received = await service.findOne(filmEntity);

      expect(received).toEqual(filmEntity);
    });

    it('should throw NotFoundException if repository find one entity returns null value (entity not found in database)', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

      await expect(() => service.findOne(filmEntity)).rejects.toThrow(error);
      await expect(() => service.findOne(filmEntity)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if an error occurs when repository find one entity', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error());
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

      await expect(() => service.findOne(filmEntity)).rejects.toThrow(error);
      await expect(() => service.findOne(filmEntity)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmEntity', async () => {
      const received = await service.updateOne(filmEntity, {});

      expect(received).toEqual(filmEntity);
    });

    it('should throw NotFoundException if entity to update not found in database', async () => {
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(() => service.updateOne(filmEntity, {})).rejects.toThrow(
        error,
      );
      await expect(() => service.updateOne(filmEntity, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if an error occurs when repository updates entity', async () => {
      jest.spyOn(repository, 'updateOne').mockRejectedValue(new Error());
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => service.updateOne(filmEntity, {})).rejects.toThrow(
        error,
      );
      await expect(() => service.updateOne(filmEntity, {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmEntity', async () => {
      const received = await service.removeOne(filmEntity);

      expect(received).toBeInstanceOf(FilmEntity);
    });

    it('should throw NotFoundException if entity to remove not found in database', async () => {
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(() => service.removeOne(filmEntity)).rejects.toThrow(error);
      await expect(() => service.removeOne(filmEntity)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if an error occurs when repository removes entity', async () => {
      jest.spyOn(repository, 'removeOne').mockRejectedValue(new Error());
      const error = new NotFoundException(ErrorMessageEnum.FILM_NOT_FOUND);

      await expect(() => service.removeOne(filmEntity)).rejects.toThrow(error);
      await expect(() => service.removeOne(filmEntity)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
