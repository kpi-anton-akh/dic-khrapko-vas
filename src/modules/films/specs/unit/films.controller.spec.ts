import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../../films.controller';
import { FilmsService } from '../../films.service';
import { CreateFilmDto, UpdateFilmDto } from '../../dto';
import { FilmEntity } from '../../entities';

describe('FilmsController unit tests', () => {
  let controller: FilmsController;

  const createOneDto = new CreateFilmDto();
  const updateOneDto = new UpdateFilmDto();
  const filmEntity = {
    id: 'fa27a0f1-0c8f-4c3e-8f27-f6f854454036',
    name: 'films controller test entity',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FilmEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      // Mocking FilmsService provider
      providers: [
        {
          provide: FilmsService,
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

    controller = module.get<FilmsController>(FilmsController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmEntity', async () => {
      const received = await controller.createOne(createOneDto);

      expect(received).toEqual(filmEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmEntities', async () => {
      const expected = [filmEntity];

      const received = await controller.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return found FilmEntity', async () => {
      const received = await controller.findOne(filmEntity);

      expect(received).toEqual(filmEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmEntity', async () => {
      const received = await controller.updateOne(filmEntity, updateOneDto);

      expect(received).toEqual(filmEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmEntity', async () => {
      const received = await controller.removeOne(filmEntity);
      expect(received).toBeInstanceOf(FilmEntity);
    });
  });
});
