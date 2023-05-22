import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmGenreEntity } from './film-genre.entity';
import { FilmGenresController } from './film-genres.controller';
import { FilmGenresRepository } from './film-genres.repository';
import { FilmGenresService } from './film-genres.service';
import { TYPEORM_CONNECTION_NAME_NOSQL } from 'src/config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmGenreEntity], TYPEORM_CONNECTION_NAME_NOSQL),
  ],
  controllers: [FilmGenresController],
  providers: [FilmGenresService, FilmGenresRepository],
  exports: [FilmGenresService],
})
export class FilmGenresModule {}
