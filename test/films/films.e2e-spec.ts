import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppConfigModule } from 'src/config';
import { CreateFilmDto, UpdateFilmDto } from 'src/modules/films/dto';
import { FilmEntity } from 'src/modules/films/entities';
import { SqlDatabaseModule } from 'src/systems/database';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM_CONNECTION_NAME } from 'src/config/app-config.service';
import { FilmsController } from 'src/modules/films/films.controller';
import { FilmsService } from 'src/modules/films/films.service';
import { FilmsRepository } from 'src/modules/films/films.repository';
import { FilmStatsPublisher } from 'src/systems/service-bus/film-stats.publisher';

describe('FilmsController endpoints tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let dbContext: Repository<FilmEntity>;

  let filmStatsPublisher: FilmStatsPublisher;
  const mockFilmStatsPublisher: jest.Mocked<Partial<FilmStatsPublisher>> = {
    publish: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([FilmEntity], TYPEORM_CONNECTION_NAME),
        AppConfigModule,
        SqlDatabaseModule,
      ],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        FilmsRepository,
        { provide: FilmStatsPublisher, useValue: mockFilmStatsPublisher },
      ],
    }).compile();
    dataSource = testingModule.get<DataSource>(
      getConnectionToken(TYPEORM_CONNECTION_NAME),
    );

    dbContext = dataSource.getRepository(FilmEntity);

    filmStatsPublisher = testingModule.get(FilmStatsPublisher);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    jest.restoreAllMocks();

    const entities = [
      {
        id: 'f914f58a-a336-42c8-b318-af2c4a7faa12',
        name: 'Titanic',
        description:
          'Titanic is a 1997 American epic romance and disaster film directed, written, produced, and co-edited by James Cameron.',
        authorsNamesInfo: 'James Cameron',
        rating: 9.73,
        releaseYear: 1997,
      },
      {
        id: '5164f275-1d13-492f-a70e-b135d05a3556',
        name: 'The Avengers',
        description:
          '2012 American superhero film based on the Marvel Comics superhero team of the same name.',
        authorsNamesInfo: 'Joss Whedon',
        rating: 8.27,
        releaseYear: 2012,
      },
    ] as Partial<FilmEntity>[];

    await dbContext.insert(entities);
  });

  afterEach(async () => {
    await dataSource.synchronize(true);
  });

  describe('createOne', () => {
    it('should receive created FilmEntity', async () => {
      // Arrange
      const createFilmDto = {
        name: 'Renfield',
        description:
          'In this modern monster tale of Dracula`s loyal servant, Nicholas Hoult stars as Renfield',
        authorsNamesInfo: 'Chris McKay',
        rating: 3.8,
        releaseYear: 2023,
      } as CreateFilmDto;
      const entitiesBefore = await dbContext.find();
      jest.spyOn(filmStatsPublisher, 'publish').mockResolvedValue();

      // Act
      const response = await request(app.getHttpServer())
        .post('/films')
        .send(createFilmDto)
        .expect(201);

      // Assert
      const received: FilmEntity = response.body;
      const entitiesAfter = await dbContext.find();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).toMatchObject(createFilmDto);
      expect(received).toHaveProperty('id');
      expect(expectedEntitiesAfter).toContainEqual(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length + 1);
      expect(filmStatsPublisher.publish).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should receive an array of FilmEntities', async () => {
      // Arrange
      const entitiesInDb = await dbContext.find();
      const expectedEntitiesInDb = entitiesInDb.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      // Act
      const response = await request(app.getHttpServer())
        .get('/films')
        .expect(200);

      // Assert
      const received: FilmEntity[] = response.body;
      expect(received).toBeDefined();
      expect(received.length).toBe(expectedEntitiesInDb.length);
      expect(received).toEqual(expect.arrayContaining(expectedEntitiesInDb));
    });
  });

  describe('findOne', () => {
    it('should receive a FilmEntities by its id', async () => {
      // Arrange
      const entityId = 'f914f58a-a336-42c8-b318-af2c4a7faa12';
      const expectedEntity = await dbContext.findOneBy({ id: entityId });
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as FilmEntity;

      // Act
      const response = await request(app.getHttpServer())
        .get(`/films/${entityId}`)
        .expect(200);

      // Assert
      const received = response.body;
      expect(received).toBeDefined();
      expect(received).toEqual(expected);
    });
  });

  describe('updateOne', () => {
    it('should receive updated FilmEntity', async () => {
      // Arrange
      const updateFilmDto = {
        name: 'Updated test film name',
      } as UpdateFilmDto;
      const entityId = 'f914f58a-a336-42c8-b318-af2c4a7faa12';
      const entitiesBefore = await dbContext.find();

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/films/${entityId}`)
        .send(updateFilmDto)
        .expect(200);

      // Assert
      const received: FilmEntity = response.body;
      const expectedEntity = await dbContext.findOneBy({ id: entityId });
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as FilmEntity;
      const entitiesAfter = await dbContext.find();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).toEqual(expected);
      expect(received).toMatchObject(updateFilmDto);
      expect(expectedEntitiesAfter).toContainEqual(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length);
    });
  });

  describe('removeOne', () => {
    it('should receive removed FilmEntity', async () => {
      // Arrange
      const entityId = 'f914f58a-a336-42c8-b318-af2c4a7faa12';
      const entitiesBefore = await dbContext.find();
      const expectedEntity = await dbContext.findOneBy({ id: entityId });
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as FilmEntity;

      // Act
      const response = await request(app.getHttpServer())
        .delete(`/films/${entityId}`)
        .expect(200);

      // Assert
      const received: FilmEntity = response.body;
      const entitiesAfter = await dbContext.find();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).not.toHaveProperty('id');
      expect(expected).toMatchObject(received);
      expect(expectedEntitiesAfter).not.toContain(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length - 1);
    });
  });
});
