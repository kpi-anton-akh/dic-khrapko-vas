import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FilmGenreEnum } from '../enums';

@Entity('films')
export class FilmEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({
    maxLength: 256,
    required: true,
    example: 'Inception',
    nullable: false,
  })
  @Column({ type: 'varchar', length: 256, nullable: false })
  public name: string;

  @ApiProperty({
    maxLength: 500,
    nullable: true,
    required: false,
    example: 'Film description',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  public description?: string;

  @ApiProperty({
    enum: FilmGenreEnum,
    required: true,
    examples: FilmGenreEnum,
  })
  @Column({ nullable: false, enum: FilmGenreEnum })
  public genre: FilmGenreEnum;

  @ApiProperty({
    maxLength: 256,
    nullable: true,
    required: false,
    example: 'Steven Allan Spielberg',
  })
  @Column({ type: 'varchar', length: 256, nullable: true })
  public authorsNamesInfo?: string;

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

  @ApiProperty({
    type: 'integer',
    required: false,
    nullable: true,
    example: 2011,
  })
  @Column({ type: 'integer', nullable: true })
  public releaseYear?: number;

  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly createdAt: Date;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly updatedAt: Date;
}
