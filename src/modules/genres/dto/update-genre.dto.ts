import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateGenreDto } from './create-genre.dto';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateGenreDto extends OmitType(CreateGenreDto, ['name']) {
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
