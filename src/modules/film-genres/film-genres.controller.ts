import { ApiTags } from '@nestjs/swagger';
import {
  Post,
  Param,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { FilmGenresService } from './film-genres.service';
import { FilmGenreEntity } from './film-genre.entity';

@ApiTags('film-genres')
@Controller('film-genres')
@UseInterceptors(ClassSerializerInterceptor)
export class FilmGenresController {
  constructor(private readonly filmGenresService: FilmGenresService) {}

  @Post(':filmId/genres/:genreId')
  public async createOne(
    @Param('filmId') filmId: string,
    @Param('genreId') genreId: string,
  ): Promise<FilmGenreEntity> {
    return this.filmGenresService.createOne(filmId, genreId);
  }

  @Get(':filmId/genres')
  public async getGenresByFilmId(
    @Param('filmId') filmId: string,
  ): Promise<string[]> {
    return this.filmGenresService.getGenresByFilmId(filmId);
  }
}
