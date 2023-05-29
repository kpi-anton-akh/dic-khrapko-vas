import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresService } from '../../film-genres.service';
import { FilmGenreEntity } from '../../film-genre.entity';
import { IBlobStorage } from 'src/systems/blob-storage/interfaces';
import { BlobStorage } from 'src/systems/blob-storage/blob-storage';
import { FilmsService } from 'src/modules/films/films.service';
import { GenresService } from 'src/modules/genres/genres.service';
import { FilmEntity } from 'src/modules/films/entities';
import { GenreEntity } from 'src/modules/genres/genre.entity';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/common/enums';

describe('FilmGenresService unit tests', () => {
  let service: FilmGenresService;

  const filmId = '4dbd84e5-0334-47b4-aca5-d8766084953a';
  const genreId = '646e6f883c8a9c0fe11971d5';
  const filmGenreEntity = {
    filmId,
    genreId,
  } as FilmGenreEntity;
  const mockFilmGenresIds = [
    '646e6f76517363f12a9e406d',
    '646e6f7c595bbe9414a4bd6d',
    '646e6f7f4958ddac9db228b7',
  ];

  const mockFilm: FilmEntity = {
    id: filmId,
    name: 'Test film genres service film name',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockGenre: GenreEntity = {
    id: genreId,
    name: 'film genres service genre name',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFilmGenresStorage: jest.Mocked<IBlobStorage> = {
    putContent: jest.fn(),
    containsFileByName: jest.fn(),
    findByFilm: jest.fn(),
  };

  const mockFilmsService: Partial<FilmsService> = {
    findOne: async () => mockFilm,
  };
  const mockGenresService: Partial<GenresService> = {
    findOneById: async () => mockGenre,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmGenresService,
        {
          provide: BlobStorage,
          useValue: mockFilmGenresStorage,
        },
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    service = module.get<FilmGenresService>(FilmGenresService);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should receive FilmGenreEntity when storage does not contain specified file', async () => {
      jest
        .spyOn(mockFilmGenresStorage, 'containsFileByName')
        .mockResolvedValue(false);
      jest.spyOn(mockFilmGenresStorage, 'putContent').mockResolvedValue();

      const received = await service.createOne(filmId, genreId);

      expect(received).toEqual(filmGenreEntity);
      expect(mockFilmGenresStorage.putContent).toHaveBeenCalledTimes(1);
      expect(mockFilmGenresStorage.putContent).toHaveBeenCalledWith(
        `${filmId}_${genreId}`,
      );
    });

    it('should receive FilmGenreEntity when storage contains specified file', async () => {
      jest
        .spyOn(mockFilmGenresStorage, 'containsFileByName')
        .mockResolvedValue(true);
      jest.spyOn(mockFilmGenresStorage, 'putContent').mockResolvedValue();

      const received = await service.createOne(filmId, genreId);

      expect(received).toEqual(filmGenreEntity);
      expect(mockFilmGenresStorage.putContent).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if film with specified id not found in database', async () => {
      const expectedError = new NotFoundException(
        ErrorMessageEnum.FILM_NOT_FOUND,
      );
      jest
        .spyOn(mockFilmGenresStorage, 'containsFileByName')
        .mockResolvedValue(false);
      jest.spyOn(mockFilmsService, 'findOne').mockRejectedValue(expectedError);

      await expect(() => service.createOne(filmId, genreId)).rejects.toThrow(
        expectedError,
      );
      await expect(() => service.createOne(filmId, genreId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if genre with specified id not found in database', async () => {
      const expectedError = new NotFoundException(
        ErrorMessageEnum.GENRE_NOT_FOUND,
      );
      jest
        .spyOn(mockFilmGenresStorage, 'containsFileByName')
        .mockResolvedValue(false);
      jest
        .spyOn(mockGenresService, 'findOneById')
        .mockRejectedValue(expectedError);

      await expect(() => service.createOne(filmId, genreId)).rejects.toThrow(
        expectedError,
      );
      await expect(() => service.createOne(filmId, genreId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getGenresByFilmId', () => {
    it('should receive an array of film genres ids', async () => {
      jest
        .spyOn(mockFilmGenresStorage, 'findByFilm')
        .mockResolvedValue(mockFilmGenresIds);

      const received = await service.getGenresByFilmId(filmId);

      expect(Array.isArray(received)).toBeTruthy();
      expect(received.length).toBe(mockFilmGenresIds.length);
      expect(received).toEqual(expect.arrayContaining(mockFilmGenresIds));
    });

    it('should throw NotFoundException if film with specified id not found in database', async () => {
      const expectedError = new NotFoundException(
        ErrorMessageEnum.FILM_NOT_FOUND,
      );
      jest
        .spyOn(mockFilmGenresStorage, 'findByFilm')
        .mockResolvedValue(mockFilmGenresIds);
      jest.spyOn(mockFilmsService, 'findOne').mockRejectedValue(expectedError);

      await expect(() => service.getGenresByFilmId(filmId)).rejects.toThrow(
        expectedError,
      );
      await expect(() => service.getGenresByFilmId(filmId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
