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
import { IdDto } from '../../common/dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('films')
@Controller('films')
@UseInterceptors(ClassSerializerInterceptor)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  public async createOne(@Body() dto: CreateFilmDto): Promise<FilmEntity> {
    const model = plainToInstance(FilmEntity, dto);

    return this.filmsService.createOne(model);
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
    const model = plainToInstance(FilmEntity, dto);

    return this.filmsService.updateOne(conditions, model);
  }

  @Delete(':id')
  public async removeOne(@Param() conditions: IdDto): Promise<FilmEntity> {
    return this.filmsService.removeOne(conditions);
  }
}
