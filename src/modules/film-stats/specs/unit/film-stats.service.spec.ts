import { Test, TestingModule } from '@nestjs/testing';
import { FilmStatsService } from '../../film-stats.service';
import { FilmStatsSubscriber } from 'src/systems/service-bus/film-stats.subscriber';

describe('FilmStatsService unit tests', () => {
  let service: FilmStatsService;

  let mockFilmStatsIds: string[];

  const mockFilmStatsSubscriber: Partial<FilmStatsSubscriber> = {
    get ids() {
      return mockFilmStatsIds;
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmStatsService,
        { provide: FilmStatsSubscriber, useValue: mockFilmStatsSubscriber },
      ],
    }).compile();

    service = module.get<FilmStatsService>(FilmStatsService);
  });

  beforeEach(async () => {
    mockFilmStatsIds = [
      '027068a7-2f3b-4ce3-a13e-abf07e18babf',
      'c9c896e0-4507-4591-8b84-406a53fb21e8',
      '492520d1-7ca8-4dcf-8c31-427d0f50da59',
    ];
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should receive created films ids stats', async () => {
      const expected = mockFilmStatsIds;

      const received = await service.getStats();

      expect(received).toBeDefined();
      expect(Array.isArray(received)).toBeTruthy();
      expect(received.length).toBe(expected.length);
      expect(received).toEqual(expect.arrayContaining(expected));
    });
  });
});
