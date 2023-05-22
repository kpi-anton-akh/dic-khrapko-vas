import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './entities';
import { FilmsController } from './films.controller';
import { FilmsRepository } from './films.repository';
import { FilmsService } from './films.service';
import { TYPEORM_CONNECTION_NAME } from 'src/config/app-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity], TYPEORM_CONNECTION_NAME)],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsService],
})
export class FilmsModule {}
