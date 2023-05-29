import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @ApiProperty({
    example: 'Inception',
    required: true,
    nullable: false,
    minLength: 2,
    maxLength: 256,
  })
  public readonly name: string;

  @IsOptional()
  @MaxLength(500)
  @ApiPropertyOptional({
    example: 'Film description',
    maxLength: 500,
    nullable: true,
    required: false,
  })
  public readonly description?: string;

  @IsOptional()
  @MaxLength(256)
  @ApiPropertyOptional({
    maxLength: 256,
    nullable: true,
    required: false,
    example: 'Steven Allan Spielberg',
  })
  public readonly authorsNamesInfo?: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty({ example: 8.75, required: true, nullable: false })
  public readonly rating: number;

  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  @ApiPropertyOptional({ example: 2011, required: false, nullable: true })
  public readonly releaseYear?: number;
}
