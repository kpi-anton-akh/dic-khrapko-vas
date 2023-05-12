import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFilmGenreDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @ApiProperty({
    example: 'Action',
    required: true,
    nullable: false,
    minLength: 2,
    maxLength: 256,
  })
  public readonly name: string;

  @IsOptional()
  @MaxLength(500)
  @ApiPropertyOptional({
    example: 'Film genre description',
    maxLength: 500,
    nullable: true,
    required: false,
  })
  public readonly description?: string;
}
