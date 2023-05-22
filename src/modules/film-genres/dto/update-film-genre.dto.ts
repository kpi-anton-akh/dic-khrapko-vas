import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateFilmGenreDto } from './create-film-genre.dto';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateFilmGenreDto extends OmitType(CreateFilmGenreDto, ['name']) {
  @ValidateIf((obj, val) => val !== undefined)
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @ApiProperty({
    example: 'Action',
    required: false,
    nullable: false,
    minLength: 2,
    maxLength: 256,
  })
  public readonly name: string;
}
