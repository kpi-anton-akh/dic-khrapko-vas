import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { FilmStatsService } from './film-stats.service';

@ApiTags('film-stats')
@Controller('film-stats')
@UseInterceptors(ClassSerializerInterceptor)
export class FilmStatsController {
  constructor(private readonly filmStatsService: FilmStatsService) {}

  @Get()
  public async getStats(): Promise<string[]> {
    return this.filmStatsService.getStats();
  }
}
