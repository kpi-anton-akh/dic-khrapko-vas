import { Injectable } from '@nestjs/common';

import { FilmStatsSubscriber } from 'src/systems/service-bus/film-stats.subscriber';

@Injectable()
export class FilmStatsService {
  constructor(private readonly filmStatsSubscriber: FilmStatsSubscriber) {}

  public async getStats(): Promise<string[]> {
    return this.filmStatsSubscriber.ids;
  }
}
