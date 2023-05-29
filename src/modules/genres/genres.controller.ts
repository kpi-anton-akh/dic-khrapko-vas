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
import { GenresService } from './genres.service';
import { CreateGenreDto, UpdateGenreDto } from './dto';
import { GenreEntity } from './genre.entity';
import { plainToInstance } from 'class-transformer';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

@ApiTags('genres')
@Controller('genres')
@UseInterceptors(ClassSerializerInterceptor)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  public async createOne(@Body() dto: CreateGenreDto): Promise<GenreEntity> {
    const model = plainToInstance(GenreEntity, dto);

    return this.genresService.createOne(model);
  }

  @Get()
  public async findAll(): Promise<GenreEntity[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  public async findOneById(
    @Param() conditions: ObjectIdDto,
  ): Promise<GenreEntity> {
    return this.genresService.findOneById(conditions.id);
  }

  @Patch(':id')
  public async updateOne(
    @Param() conditions: ObjectIdDto,
    @Body() dto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    const model = plainToInstance(GenreEntity, dto);

    return this.genresService.updateOne(conditions.id, model);
  }

  @Delete(':id')
  public async removeOne(
    @Param() conditions: ObjectIdDto,
  ): Promise<GenreEntity> {
    return this.genresService.removeOne(conditions.id);
  }
}
