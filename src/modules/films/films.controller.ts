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
import { FilmsService } from './films.service';
import { CreateFilmDto, UpdateFilmDto } from './dto';
import { FilmEntity } from './entities';
import { IdDto } from 'src/common/dto';

@ApiTags('films')
@Controller('films')
@UseInterceptors(ClassSerializerInterceptor)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  public async createOne(@Body() dto: CreateFilmDto): Promise<FilmEntity> {
    return this.filmsService.createOne(dto);
  }

  @Get()
  public async findAll(): Promise<FilmEntity[]> {
    return this.filmsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param() conditions: IdDto): Promise<FilmEntity> {
    return this.filmsService.findOne(conditions);
  }

  @Patch(':id')
  public async updateOne(
    @Param() conditions: IdDto,
    @Body() dto: UpdateFilmDto,
  ): Promise<FilmEntity> {
    return this.filmsService.updateOne(conditions, dto);
  }

  @Delete(':id')
  public async removeOne(@Param() conditions: IdDto): Promise<FilmEntity> {
    return this.filmsService.removeOne(conditions);
  }
}
