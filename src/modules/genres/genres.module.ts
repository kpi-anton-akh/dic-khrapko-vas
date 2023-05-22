import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './genre.entity';
import { GenresService } from './genres.service';
import { TYPEORM_CONNECTION_NAME_NOSQL } from 'src/config/app-config.service';
import { GenresController } from './genres.controller';
import { GenresRepository } from './genres.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreEntity], TYPEORM_CONNECTION_NAME_NOSQL),
  ],
  controllers: [GenresController],
  providers: [GenresService, GenresRepository],
  exports: [GenresService],
})
export class GenresModule {}
