import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from '../../genres.controller';
import { GenresService } from '../../genres.service';
import { CreateGenreDto, UpdateGenreDto } from '../../dto';
import { GenreEntity } from '../../genre.entity';

describe('GenresController unit tests', () => {
  let controller: GenresController;

  const createOneDto = new CreateGenreDto();
  const updateOneDto = new UpdateGenreDto();
  const genreEntity = {
    id: '645ea97f857f8bfa3377fd1e',
    name: 'film genres controller test entity name',
    desciption: 'film genres controller test entity description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as GenreEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      // Mocking GenresService provider
      providers: [
        {
          provide: GenresService,
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

    controller = module.get<GenresController>(GenresController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should return created GenreEntity', async () => {
      const received = await controller.createOne(createOneDto);

      expect(received).toEqual(genreEntity);
    });
  });

  describe('findAll', () => {
    it('should return array of found GenreEntities', async () => {
      const expected = [genreEntity];

      const received = await controller.findAll();

      expect(Array.isArray(received)).toBe(true);
      expect(received).toEqual(expected);
    });
  });

  describe('findOneById', () => {
    it('should return found GenreEntity', async () => {
      const received = await controller.findOneById({ id: genreEntity.id });

      expect(received).toEqual(genreEntity);
    });
  });

  describe('updateOne', () => {
    it('should return updated GenreEntity', async () => {
      const received = await controller.updateOne(
        { id: genreEntity.id },
        updateOneDto,
      );

      expect(received).toEqual(genreEntity);
    });
  });

  describe('removeOne', () => {
    it('should return removed GenreEntity', async () => {
      const received = await controller.removeOne({ id: genreEntity.id });
      expect(received).toBeInstanceOf(GenreEntity);
    });
  });
});
