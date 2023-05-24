import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresController } from '../../film-genres.controller';
import { FilmGenresService } from '../../film-genres.service';
import { FilmGenreEntity } from '../../film-genre.entity';

describe('FilmGenresController unit tests', () => {
  let controller: FilmGenresController;

  const filmId = '7f689cda-1eab-4c59-b123-c1f1aafc4d10';
  const genreId = '646e4e82fbeb3b02846e14c9';
  const filmGenreEntity = {
    filmId,
    genreId,
  } as FilmGenreEntity;
  const filmGenresIds = [
    '646e4ed558c8aa19e17fdc40',
    '646e4edbfc4b6d6e5a441575',
    '646e4ee0d053e75a764e7944',
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmGenresController],
      // Mocking FilmGenres provider
      providers: [
        {
          provide: FilmGenresService,
          useValue: {
            createOne: async () => filmGenreEntity,
            getGenresByFilmId: async () => filmGenresIds,
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
    it('should receive created FilmGenreEntity', async () => {
      const received = await controller.createOne(filmId, genreId);

      expect(received).toEqual(filmGenreEntity);
    });
  });

  describe('getGenresByFilmId', () => {
    it('should receive an array of film genres ids', async () => {
      const received = await controller.getGenresByFilmId(filmId);

      expect(Array.isArray(received)).toBeTruthy();
      expect(received.length).toBe(filmGenresIds.length);
      expect(received).toEqual(expect.arrayContaining(filmGenresIds));
    });
  });
});
