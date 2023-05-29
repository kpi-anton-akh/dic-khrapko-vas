import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilmGenreEntity {
  @Type(() => String)
  @ApiProperty({
    required: true,
    nullable: false,
  })
  public filmId: string;

  @Type(() => String)
  @ApiProperty({
    required: true,
    nullable: false,
  })
  public genreId: string;

  constructor(filmId, genreId) {
    this.filmId = filmId;
    this.genreId = genreId;
  }
}
