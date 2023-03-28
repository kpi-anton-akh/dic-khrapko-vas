import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../../films.controller';
import { FilmsService } from '../../films.service';
import { CreateFilmDto, UpdateFilmDto } from '../../dto';
import { FilmEntity } from '../../entities';

describe('FilmsController unit tests', () => {
  let controller: FilmsController;

  const createOneDto = new CreateFilmDto();
  const updateOneDto = new UpdateFilmDto();
  const filmEntity = new FilmEntity();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      // Mocking FilmsService provider
      providers: [
        {
          provide: FilmsService,
          useValue: {
            createOne: (entity: Partial<FilmEntity>) =>
              plainToInstance(FilmEntity, { ...entity, ...filmEntity }),
            findAll: () => [filmEntity],
            findOne: () => filmEntity,
            updateOne: (
              conditions: Partial<FilmEntity>,
              entity: Partial<FilmEntity>,
            ) =>
              plainToInstance(FilmEntity, {
                ...conditions,
                ...filmEntity,
                ...entity,
              }),
            removeOne: () => new FilmEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const received = await controller.createOne(createOneDto);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const received = await controller.findAll();
      expect(Array.isArray(received)).toBe(true);
      for (const entity of received) {
        expect(entity).toBeInstanceOf(FilmEntity);
      }
    });
  });

  describe('findOne', () => {
    it('should return found FilmEntity', async () => {
      const received = await controller.findOne(filmEntity);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmEntity', async () => {
      const received = await controller.updateOne(filmEntity, updateOneDto);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmEntity', async () => {
      const received = await controller.removeOne(filmEntity);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });
});
