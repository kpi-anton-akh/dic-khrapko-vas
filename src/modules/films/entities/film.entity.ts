import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';
import { FilmGenreEnum } from '../enums';

@Entity('films')
export class FilmEntity {
  @Type(() => String)
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Type(() => String)
  @ApiProperty({
    maxLength: 256,
    required: true,
    example: 'Inception',
    nullable: false,
  })
  @Column({ type: 'varchar', length: 256, nullable: false })
  public name: string;

  @Type(() => String)
  @ApiProperty({
    maxLength: 500,
    nullable: true,
    required: false,
    example: 'Film description',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  public description?: string;

  @Type(() => FilmGenreEnum as unknown as () => FilmGenreEnum)
  @ApiProperty({
    enum: FilmGenreEnum,
    required: true,
    examples: FilmGenreEnum,
  })
  @Column({ nullable: false, enum: FilmGenreEnum })
  public genre: FilmGenreEnum;

  @Type(() => String)
  @ApiProperty({
    maxLength: 256,
    nullable: true,
    required: false,
    example: 'Steven Allan Spielberg',
  })
  @Column({ type: 'varchar', length: 256, nullable: true })
  public authorsNamesInfo?: string;

  @Type(() => Number)
  @ApiProperty({
    type: Number,
    nullable: true,
    example: 8.35,
  })
  @Column({
    type: 'numeric',
    scale: 2,
    precision: 4,
    nullable: true,
  })
  public readonly rating?: number;

  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    required: false,
    nullable: true,
    example: 2011,
  })
  @Column({ type: 'integer', nullable: true })
  public releaseYear?: number;

  @Type(() => Date)
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
  })
  public readonly createdAt: Date;

  @Type(() => Date)
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
  })
  public readonly updatedAt: Date;
}
