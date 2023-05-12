import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresController } from '../../film-genres.controller';
import { FilmGenresService } from '../../film-genres.service';
import { CreateFilmGenreDto, UpdateFilmGenreDto } from '../../dto';
import { FilmGenreEntity } from '../../film-genre.entity';

describe('FilmGenresController unit tests', () => {
  let controller: FilmGenresController;

  const createOneDto = new CreateFilmGenreDto();
  const updateOneDto = new UpdateFilmGenreDto();
  const filmGenreEntity = {
    id: '645ea97f857f8bfa3377fd1e',
    name: 'film genres controller test entity name',
    desciption: 'film genres controller test entity description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FilmGenreEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmGenresController],
      // Mocking FilmGenresService provider
      providers: [
        {
          provide: FilmGenresService,
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

    controller = module.get<FilmGenresController>(FilmGenresController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created FilmGenreEntity', async () => {
      const received = await controller.createOne(createOneDto);

      expect(received).toEqual(filmGenreEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found FilmGenreEntities', async () => {
      const expected = [filmGenreEntity];

      const received = await controller.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });
  });

  describe('findOneById', () => {
    it('should return found FilmGenreEntity', async () => {
      const received = await controller.findOneById({ id: filmGenreEntity.id });

      expect(received).toEqual(filmGenreEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated FilmGenreEntity', async () => {
      const received = await controller.updateOne(
        { id: filmGenreEntity.id },
        updateOneDto,
      );

      expect(received).toEqual(filmGenreEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed FilmGenreEntity', async () => {
      const received = await controller.removeOne({ id: filmGenreEntity.id });
      expect(received).toBeInstanceOf(FilmGenreEntity);
    });
  });
});
