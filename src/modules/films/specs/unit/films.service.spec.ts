import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from '../../films.service';
import { FilmEntity } from '../../entities';
import { FilmsRepository } from '../../films.repository';

describe('FilmsService unit tests', () => {
  let service: FilmsService;

  const filmEntity = new FilmEntity();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        // Mocking FilmsRepository provider
        {
          provide: FilmsRepository,
          useValue: {
            createOne: async (entity: Partial<FilmEntity>) =>
              plainToInstance(FilmEntity, { ...entity, ...filmEntity }),
            findAll: async () => [filmEntity],
            findOne: async () => filmEntity,
            updateOne: async (
              conditions: Partial<FilmEntity>,
              entity: Partial<FilmEntity>,
            ) =>
              plainToInstance(FilmEntity, {
                ...conditions,
                ...filmEntity,
                ...entity,
              }),
            removeOne: async () => new FilmEntity(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const received = await service.createOne(filmEntity);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const received = await service.findAll();
      expect(Array.isArray(received)).toBe(true);
      for (const entity of received) {
        expect(entity).toBeInstanceOf(FilmEntity);
      }
    });
  });

  describe('findOne', () => {
    it('should return found FilmEntity', async () => {
      const received = await service.findOne({ ...filmEntity });
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmEntity', async () => {
      const received = await service.updateOne(
        { ...filmEntity },
        { name: 'new name' },
      );
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmEntity', async () => {
      const received = await service.removeOne({ ...filmEntity });
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });
});
