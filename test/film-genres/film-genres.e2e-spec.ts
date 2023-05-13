import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppConfigModule } from 'src/config';
import { FilmGenresRepository } from 'src/modules/film-genres/film-genres.repository';
import { FilmGenreEntity } from 'src/modules/film-genres/film-genre.entity';
import { FilmGenresController } from 'src/modules/film-genres/film-genres.controller';
import { FilmGenresService } from 'src/modules/film-genres/film-genres.service';
import {
  CreateFilmGenreDto,
  UpdateFilmGenreDto,
} from 'src/modules/film-genres/dto';

describe('FilmGenresController endpoints tests', () => {
  let app: INestApplication;
  let repository: FilmGenresRepository;

  let mockEntities: FilmGenreEntity[] = [];

  const mockRepository = {
    createOne: jest.fn(),
    findAll: async (): Promise<FilmGenreEntity[]> => [...mockEntities],
    findOneById: async (id: string): Promise<FilmGenreEntity> => {
      return mockEntities.find((entity) => entity.id === id);
    },
    updateOne: async (
      entityToUpdate: FilmGenreEntity,
      entity: Partial<FilmGenreEntity>,
    ): Promise<FilmGenreEntity> => {
      const updatedEntity = { ...entityToUpdate, ...entity };
      const entityIndex = mockEntities.findIndex(
        (el) => el.id === updatedEntity.id,
      );
      mockEntities[entityIndex] = updatedEntity;
      return updatedEntity;
    },
    removeOne: async (entity: FilmGenreEntity): Promise<FilmGenreEntity> => {
      mockEntities = mockEntities.filter(
        (mockEntity) => mockEntity.id !== entity.id,
      );
      return { ...entity, id: undefined };
    },
  };

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [FilmGenresController],
      providers: [
        FilmGenresService,
        // Mocking FilmGenresRepository provider
        {
          provide: FilmGenresRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = testingModule.get(FilmGenresRepository);

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.restoreAllMocks();
    mockEntities = [
      {
        id: '645f44ecb80b43669541373b',
        name: 'Action',
        description:
          'Film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '645f44f1148ac47c02472f63',
        name: 'Horror',
        description:
          'Film genre intended to scare, shock, and thrill its audience',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '645f44f66e619a2eb6db605d',
        name: 'Drama',
        description:
          'Film genre that relies on the emotional and relational development of realistic characters',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as FilmGenreEntity[];
  });

  describe('createOne', () => {
    it('should receive created FilmGenreEntity', async () => {
      // Arrange
      const createFilmGenreDto = {
        name: 'Comedy',
        description: 'Comedy film is a genre of film which emphasizes humor',
      } as CreateFilmGenreDto;
      const entitiesBefore = await repository.findAll();
      jest
        .spyOn(repository, 'createOne')
        .mockImplementation(async (entity): Promise<FilmGenreEntity> => {
          const createdEntity = {
            ...entity,
            id: '645f5fd4906e033bd3ad2218',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as FilmGenreEntity;
          mockEntities.push(createdEntity);
          return createdEntity;
        });

      // Act
      const response = await request(app.getHttpServer())
        .post('/film-genres')
        .send(createFilmGenreDto)
        .expect(201);

      // Assert
      const received: FilmGenreEntity = response.body;
      const entitiesAfter = await repository.findAll();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).toMatchObject(createFilmGenreDto);
      expect(received).toHaveProperty('id');
      expect(expectedEntitiesAfter).toContainEqual(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length + 1);
    });
  });

  describe('findAll', () => {
    it('should receive an array of FilmGenreEntities', async () => {
      // Arrange
      const entitiesInDb = await repository.findAll();
      const expectedEntitiesInDb = entitiesInDb.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      // Act
      const response = await request(app.getHttpServer())
        .get('/film-genres')
        .expect(200);

      // Assert
      const received: FilmGenreEntity[] = response.body;
      expect(received).toBeDefined();
      expect(received.length).toBe(expectedEntitiesInDb.length);
      expect(received).toEqual(expect.arrayContaining(expectedEntitiesInDb));
    });
  });

  describe('findOneById', () => {
    it('should receive a FilmGenreEntity by its id', async () => {
      // Arrange
      const entityId = '645f44ecb80b43669541373b';
      const expectedEntity = await repository.findOneById(entityId);
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as FilmGenreEntity;

      // Act
      const response = await request(app.getHttpServer())
        .get(`/film-genres/${entityId}`)
        .expect(200);

      // Assert
      const received = response.body;
      expect(received).toBeDefined();
      expect(received).toEqual(expected);
    });
  });

  describe('updateOne', () => {
    it('should receive updated FilmGenreEntity', async () => {
      // Arrange
      const updateFilmGenreDto = {
        name: 'Updated test film genre name',
      } as UpdateFilmGenreDto;
      const entityId = '645f44ecb80b43669541373b';
      const entitiesBefore = await repository.findAll();

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/film-genres/${entityId}`)
        .send(updateFilmGenreDto)
        .expect(200);

      // Assert
      const received: FilmGenreEntity = response.body;
      const expectedEntity = await repository.findOneById(entityId);
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as FilmGenreEntity;
      const entitiesAfter = await repository.findAll();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).toEqual(expected);
      expect(received).toMatchObject(updateFilmGenreDto);
      expect(expectedEntitiesAfter).toContainEqual(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length);
    });
  });

  describe('removeOne', () => {
    it('should receive removed FilmGenreEntity', async () => {
      // Arrange
      const entityId = '645f44ecb80b43669541373b';
      const entitiesBefore = await repository.findAll();
      const expectedEntity = await repository.findOneById(entityId);
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as FilmGenreEntity;

      // Act
      const response = await request(app.getHttpServer())
        .delete(`/film-genres/${entityId}`)
        .expect(200);

      // Assert
      const received: FilmGenreEntity = response.body;
      const entitiesAfter = await repository.findAll();
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
