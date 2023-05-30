import { Module } from '@nestjs/common';
import { FilmStatsService } from './film-stats.service';
import { AppConfigService } from 'src/config/app-config.service';
import {
  FILM_STATS_QUEUE_NAME,
  SERVICE_BUS_QUEUE_NAME_TOKEN,
} from 'src/common/constants';
import { AppConfigModule } from 'src/config';
import { FilmStatsController } from './film-stats.controller';
import { FilmStatsPublisher } from 'src/systems/service-bus/film-stats.publisher';
import { FilmStatsSubscriber } from 'src/systems/service-bus/film-stats.subscriber';
import { ServiceBusClient } from '@azure/service-bus';

@Module({
  imports: [AppConfigModule],
  controllers: [FilmStatsController],
  providers: [
    FilmStatsService,
    FilmStatsPublisher,
    FilmStatsSubscriber,
    {
      provide: ServiceBusClient,
      useFactory: (appConfigService: AppConfigService) =>
        new ServiceBusClient(
          appConfigService.get('AZURE_SERVICE_BUS_CONNECTION_STRING'),
        ),
      inject: [AppConfigService],
    },
    { provide: SERVICE_BUS_QUEUE_NAME_TOKEN, useValue: FILM_STATS_QUEUE_NAME },
  ],
  exports: [FilmStatsPublisher],
})
export class FilmStatsModule {}
