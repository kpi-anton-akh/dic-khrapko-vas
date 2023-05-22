import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppConfigModule } from 'src/config';
import { GenresRepository } from 'src/modules/genres/genres.repository';
import { GenreEntity } from 'src/modules/genres/genre.entity';
import { GenresController } from 'src/modules/genres/genres.controller';
import { GenresService } from 'src/modules/genres/genres.service';
import { CreateGenreDto, UpdateGenreDto } from 'src/modules/genres/dto';

describe('GenresController endpoints tests', () => {
  let app: INestApplication;
  let repository: GenresRepository;

  let mockEntities: GenreEntity[] = [];

  const mockRepository = {
    createOne: jest.fn(),
    findAll: async (): Promise<GenreEntity[]> => [...mockEntities],
    findOneById: async (id: string): Promise<GenreEntity> => {
      return mockEntities.find((entity) => entity.id === id);
    },
    updateOne: async (
      entityToUpdate: GenreEntity,
      entity: Partial<GenreEntity>,
    ): Promise<GenreEntity> => {
      const updatedEntity = { ...entityToUpdate, ...entity };
      const entityIndex = mockEntities.findIndex(
        (el) => el.id === updatedEntity.id,
      );
      mockEntities[entityIndex] = updatedEntity;
      return updatedEntity;
    },
    removeOne: async (entity: GenreEntity): Promise<GenreEntity> => {
      mockEntities = mockEntities.filter(
        (mockEntity) => mockEntity.id !== entity.id,
      );
      return { ...entity, id: undefined };
    },
  };

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [GenresController],
      providers: [
        GenresService,
        // Mocking GenresRepository provider
        {
          provide: GenresRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = testingModule.get(GenresRepository);

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
    ] as GenreEntity[];
  });

  describe('createOne', () => {
    it('should receive created GenreEntity', async () => {
      // Arrange
      const createGenreDto = {
        name: 'Comedy',
        description: 'Comedy film is a genre of film which emphasizes humor',
      } as CreateGenreDto;
      const entitiesBefore = await repository.findAll();
      jest
        .spyOn(repository, 'createOne')
        .mockImplementation(async (entity): Promise<GenreEntity> => {
          const createdEntity = {
            ...entity,
            id: '645f5fd4906e033bd3ad2218',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as GenreEntity;
          mockEntities.push(createdEntity);
          return createdEntity;
        });

      // Act
      const response = await request(app.getHttpServer())
        .post('/genres')
        .send(createGenreDto)
        .expect(201);

      // Assert
      const received: GenreEntity = response.body;
      const entitiesAfter = await repository.findAll();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).toMatchObject(createGenreDto);
      expect(received).toHaveProperty('id');
      expect(expectedEntitiesAfter).toContainEqual(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length + 1);
    });
  });

  describe('findAll', () => {
    it('should receive an array of GenreEntities', async () => {
      // Arrange
      const entitiesInDb = await repository.findAll();
      const expectedEntitiesInDb = entitiesInDb.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      // Act
      const response = await request(app.getHttpServer())
        .get('/genres')
        .expect(200);

      // Assert
      const received: GenreEntity[] = response.body;
      expect(received).toBeDefined();
      expect(received.length).toBe(expectedEntitiesInDb.length);
      expect(received).toEqual(expect.arrayContaining(expectedEntitiesInDb));
    });
  });

  describe('findOneById', () => {
    it('should receive a GenreEntity by its id', async () => {
      // Arrange
      const entityId = '645f44ecb80b43669541373b';
      const expectedEntity = await repository.findOneById(entityId);
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as GenreEntity;

      // Act
      const response = await request(app.getHttpServer())
        .get(`/genres/${entityId}`)
        .expect(200);

      // Assert
      const received = response.body;
      expect(received).toBeDefined();
      expect(received).toEqual(expected);
    });
  });

  describe('updateOne', () => {
    it('should receive updated GenreEntity', async () => {
      // Arrange
      const updateGenreDto = {
        name: 'Updated test film genre name',
      } as UpdateGenreDto;
      const entityId = '645f44ecb80b43669541373b';
      const entitiesBefore = await repository.findAll();

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/genres/${entityId}`)
        .send(updateGenreDto)
        .expect(200);

      // Assert
      const received: GenreEntity = response.body;
      const expectedEntity = await repository.findOneById(entityId);
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as GenreEntity;
      const entitiesAfter = await repository.findAll();
      const expectedEntitiesAfter = entitiesAfter.map((entity) => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      }));

      expect(received).toBeDefined();
      expect(received).toEqual(expected);
      expect(received).toMatchObject(updateGenreDto);
      expect(expectedEntitiesAfter).toContainEqual(received);
      expect(expectedEntitiesAfter.length).toBe(entitiesBefore.length);
    });
  });

  describe('removeOne', () => {
    it('should receive removed GenreEntity', async () => {
      // Arrange
      const entityId = '645f44ecb80b43669541373b';
      const entitiesBefore = await repository.findAll();
      const expectedEntity = await repository.findOneById(entityId);
      const expected = {
        ...expectedEntity,
        createdAt: expectedEntity.createdAt.toISOString(),
        updatedAt: expectedEntity.updatedAt.toISOString(),
      } as unknown as GenreEntity;

      // Act
      const response = await request(app.getHttpServer())
        .delete(`/genres/${entityId}`)
        .expect(200);

      // Assert
      const received: GenreEntity = response.body;
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
