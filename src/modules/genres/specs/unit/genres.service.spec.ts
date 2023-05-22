import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from '../../genres.service';
import { GenresRepository } from '../../genres.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/common/enums';
import { GenreEntity } from '../../genre.entity';

describe('GenresService unit tests', () => {
  let repository: GenresRepository;
  let service: GenresService;

  const genreEntity = {
    id: '645f3cd9c1635ae1fe9c92e4',
    name: 'film genres service test entity name',
    desciption: 'film genres service test entity description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as GenreEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        // Mocking GenresRepository provider
        {
          provide: GenresRepository,
          useValue: {
            createOne: async () => genreEntity,
            findAll: async () => [genreEntity],
            findOneById: async () => genreEntity,
            updateOne: async () => genreEntity,
            removeOne: async () => new GenreEntity(),
          },
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    repository = module.get<GenresRepository>(GenresRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created GenreEntity', async () => {
      const received = await service.createOne(genreEntity);

      expect(received).toEqual(genreEntity);
    });

    it('should throw BadRequestException if an error occurs when repository creates new entity', async () => {
      jest.spyOn(repository, 'createOne').mockRejectedValue(new Error());
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => service.createOne(genreEntity)).rejects.toThrow(error);
      await expect(() => service.createOne(genreEntity)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of found GenreEntities', async () => {
      const expected = [genreEntity];

      const received = await service.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });

    it('should throw NotFoundException if an error occurs when repository find all entities', async () => {
      jest.spyOn(repository, 'findAll').mockRejectedValue(new Error());
      const error = new NotFoundException(ErrorMessageEnum.GENRES_NOT_FOUND);

      await expect(() => service.findAll()).rejects.toThrow(error);
      await expect(() => service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return found GenreEntity', async () => {
      const received = await service.findOneById(genreEntity.id);

      expect(received).toEqual(genreEntity);
    });

    it('should throw NotFoundException if repository find one entity by id returns null value (entity not found in database)', async () => {
      jest.spyOn(repository, 'findOneById').mockResolvedValue(null);
      const error = new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);

      await expect(() => service.findOneById(genreEntity.id)).rejects.toThrow(
        error,
      );
      await expect(() => service.findOneById(genreEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if an error occurs when repository find one entity', async () => {
      jest.spyOn(repository, 'findOneById').mockRejectedValue(new Error());
      const error = new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);

      await expect(() => service.findOneById(genreEntity.id)).rejects.toThrow(
        error,
      );
      await expect(() => service.findOneById(genreEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOne', () => {
    it('should return updated GenreEntity', async () => {
      const received = await service.updateOne(genreEntity.id, {});

      expect(received).toEqual(genreEntity);
    });

    it('should throw NotFoundException if entity to update not found in database', async () => {
      const error = new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);
      jest.spyOn(service, 'findOneById').mockRejectedValue(error);

      await expect(() => service.updateOne(genreEntity.id, {})).rejects.toThrow(
        error,
      );
      await expect(() => service.updateOne(genreEntity.id, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if an error occurs when repository updates entity', async () => {
      jest.spyOn(repository, 'updateOne').mockRejectedValue(new Error());
      const error = new BadRequestException(ErrorMessageEnum.INVALID_DATA);

      await expect(() => service.updateOne(genreEntity.id, {})).rejects.toThrow(
        error,
      );
      await expect(() => service.updateOne(genreEntity.id, {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeOne', () => {
    it('should return removed GenreEntity', async () => {
      const received = await service.removeOne(genreEntity.id);

      expect(received).toBeInstanceOf(GenreEntity);
    });

    it('should throw NotFoundException if entity to remove not found in database', async () => {
      const error = new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);
      jest.spyOn(service, 'findOneById').mockRejectedValue(error);

      await expect(() => service.removeOne(genreEntity.id)).rejects.toThrow(
        error,
      );
      await expect(() => service.removeOne(genreEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if an error occurs when repository removes entity', async () => {
      jest.spyOn(repository, 'removeOne').mockRejectedValue(new Error());
      const error = new NotFoundException(ErrorMessageEnum.GENRE_NOT_FOUND);

      await expect(() => service.removeOne(genreEntity.id)).rejects.toThrow(
        error,
      );
      await expect(() => service.removeOne(genreEntity.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
