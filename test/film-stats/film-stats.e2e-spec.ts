import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { FilmStatsSubscriber } from 'src/systems/service-bus/film-stats.subscriber';
import { FilmStatsController } from 'src/modules/film-stats/film-stats.controller';
import { FilmStatsService } from 'src/modules/film-stats/film-stats.service';

describe('FilmStatsController endpoints tests', () => {
  let app: INestApplication;

  let mockFilmStatsIds: string[];

  const mockFilmStatsSubscriber: Partial<FilmStatsSubscriber> = {
    get ids() {
      return mockFilmStatsIds;
    },
  };

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [FilmStatsController],
      providers: [
        FilmStatsService,
        { provide: FilmStatsSubscriber, useValue: mockFilmStatsSubscriber },
      ],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.restoreAllMocks();

    mockFilmStatsIds = [
      '3ab6fe17-8af7-484e-aba1-94ec95c06f5d',
      '5b76ac8b-fae6-4ca1-a582-6aafb19bc4f9',
      'e47beda1-7dd7-4492-a456-5ce89570ab8c',
    ];
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getStats', () => {
    it('should receive created films ids stats', async () => {
      // Arrange
      const expected = mockFilmStatsIds;

      // Act
      const response = await request(app.getHttpServer())
        .get(`/film-stats`)
        .expect(200);

      // Assert
      const received: string[] = response.body;
      expect(received).toBeDefined();
      expect(received.length).toBe(expected.length);
      expect(received).toEqual(expect.arrayContaining(expected));
    });
  });
});
