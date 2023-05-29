import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppConfigModule } from 'src/config';
import { GenreEntity } from 'src/modules/genres/genre.entity';
import { GenresService } from 'src/modules/genres/genres.service';
import { BlobStorage } from 'src/systems/blob-storage/blob-storage';
import { IBlobStorage } from 'src/systems/blob-storage/interfaces';
import { FilmEntity } from 'src/modules/films/entities';
import { FilmGenresController } from 'src/modules/film-genres/film-genres.controller';
import { FilmGenresService } from 'src/modules/film-genres/film-genres.service';
import { FilmGenreEntity } from 'src/modules/film-genres/film-genre.entity';
import { SqlDatabaseModule } from 'src/systems/database';
import { FilmsModule } from 'src/modules/films';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION_NAME } from 'src/config/app-config.service';
import { DataSource, Repository } from 'typeorm';

describe('FilmGenresController endpoints tests', () => {
  let app: INestApplication;

  let sqlDbDataSource: DataSource;
  let filmsRepositoryDbContext: Repository<FilmEntity>;
  let filmGenresStorage: IBlobStorage;

  let filmEntity: FilmEntity;
  let mockGenreEntity: GenreEntity;
  let mockFilmGenresIds: string[];

  const mockGenresService: Partial<GenresService> = {
    findOneById: async () => mockGenreEntity,
  };
  const mockFilmGenresStorage: jest.Mocked<IBlobStorage> = {
    putContent: jest.fn(),
    containsFileByName: jest.fn(),
    findByFilm: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([FilmEntity], TYPEORM_CONNECTION_NAME),
        AppConfigModule,
        SqlDatabaseModule,
        FilmsModule,
      ],
      controllers: [FilmGenresController],
      providers: [
        FilmGenresService,
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
        {
          provide: BlobStorage,
          useValue: mockFilmGenresStorage,
        },
      ],
    }).compile();
    sqlDbDataSource = testingModule.get<DataSource>(
      getConnectionToken(TYPEORM_CONNECTION_NAME),
    );
    filmsRepositoryDbContext = sqlDbDataSource.getRepository(FilmEntity);

    filmGenresStorage = testingModule.get(BlobStorage);

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await sqlDbDataSource.dropDatabase();
    await sqlDbDataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    jest.restoreAllMocks();

    filmEntity = {
      id: 'a2ad9e79-2e67-44ea-8eb6-6d3ea756a624',
      name: 'The Godfather',
      description:
        'Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger',
      authorsNamesInfo: 'James Cameron',
      rating: 9.99,
      releaseYear: 1972,
    } as FilmEntity;
    await filmsRepositoryDbContext.insert(filmEntity);

    mockGenreEntity = {
      id: '646e37459e107559d0097990',
      name: 'Fantasy',
      description:
        'Genre of speculative fiction involving magical elements, typically set in a fictional universe',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as GenreEntity;

    mockFilmGenresIds = [
      '646e383b54397ec29b498ce5',
      '646e384112b0b4d8adb278bc',
      '646e3847a7aad72b0798c981',
    ];
  });

  afterEach(async () => {
    await sqlDbDataSource.synchronize(true);
  });

  describe('createOne', () => {
    it('should receive FilmGenreEntity and call filmGenresStorage.putContent() method', async () => {
      // Arrange
      const filmId = filmEntity.id;
      const mockGenreId = mockGenreEntity.id;
      const expected = {
        filmId: filmId,
        genreId: mockGenreId,
      } as FilmGenreEntity;
      const expectedCallWith = `${filmId}_${mockGenreId}`;

      jest
        .spyOn(filmGenresStorage, 'containsFileByName')
        .mockResolvedValue(false);
      jest.spyOn(filmGenresStorage, 'putContent').mockResolvedValue();

      // Act
      const response = await request(app.getHttpServer())
        .post(`/film-genres/${filmId}/genres/${mockGenreId}`)
        .expect(201);

      // Assert
      const received: FilmGenreEntity = response.body;

      expect(received).toBeDefined();
      expect(received).toEqual(expected);
      expect(filmGenresStorage.putContent).toHaveBeenCalledTimes(1);
      expect(filmGenresStorage.putContent).toHaveBeenCalledWith(
        expectedCallWith,
      );
    });
  });

  describe('getGenresByFilmId', () => {
    it('should receive an array of film genres ids', async () => {
      // Arrange
      const expected = mockFilmGenresIds;
      const filmId = filmEntity.id;
      jest
        .spyOn(filmGenresStorage, 'findByFilm')
        .mockResolvedValue(mockFilmGenresIds);

      // Act
      const response = await request(app.getHttpServer())
        .get(`/film-genres/${filmId}/genres`)
        .expect(200);

      // Assert
      const received: string[] = response.body;
      expect(received).toBeDefined();
      expect(received.length).toBe(expected.length);
      expect(received).toEqual(expect.arrayContaining(expected));
    });
  });
});
