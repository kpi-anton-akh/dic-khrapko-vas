import { ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FilmGenresService } from './film-genres.service';
import { CreateFilmGenreDto, UpdateFilmGenreDto } from './dto';
import { FilmGenreEntity } from './film-genre.entity';
import { plainToInstance } from 'class-transformer';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

@ApiTags('film-genres')
@Controller('film-genres')
@UseInterceptors(ClassSerializerInterceptor)
export class FilmGenresController {
  constructor(private readonly filmGenresService: FilmGenresService) {}

  @Post()
  public async createOne(
    @Body() dto: CreateFilmGenreDto,
  ): Promise<FilmGenreEntity> {
    const model = plainToInstance(FilmGenreEntity, dto);

    return this.filmGenresService.createOne(model);
  }

  @Get()
  public async findAll(): Promise<FilmGenreEntity[]> {
    return this.filmGenresService.findAll();
  }

  @Get(':id')
  public async findOneById(
    @Param() conditions: ObjectIdDto,
  ): Promise<FilmGenreEntity> {
    return this.filmGenresService.findOneById(conditions.id);
  }

  @Patch(':id')
  public async updateOne(
    @Param() conditions: ObjectIdDto,
    @Body() dto: UpdateFilmGenreDto,
  ): Promise<FilmGenreEntity> {
    const model = plainToInstance(FilmGenreEntity, dto);

    return this.filmGenresService.updateOne(conditions.id, model);
  }

  @Delete(':id')
  public async removeOne(
    @Param() conditions: ObjectIdDto,
  ): Promise<FilmGenreEntity> {
    return this.filmGenresService.removeOne(conditions.id);
  }
}
