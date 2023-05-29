import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';
import { Type } from 'class-transformer';
import { ObjectID } from 'mongodb';

@Entity('genres')
export class GenreEntity {
  @Type(() => String)
  @ApiProperty({ readOnly: true })
  @ObjectIdColumn({
    type: ObjectID,
  })
  public readonly id: string;

  @Type(() => String)
  @ApiProperty({
    required: true,
    example: 'Action',
    nullable: false,
  })
  @Column({ type: 'string', nullable: false })
  public name: string;

  @Type(() => String)
  @ApiProperty({
    nullable: true,
    required: false,
    example: 'Film genre description',
  })
  @Column({ type: 'string', nullable: true })
  public description?: string;

  @Type(() => Date)
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    type: 'timestamp',
    readonly: true,
  })
  public readonly createdAt: Date;

  @Type(() => Date)
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({ type: 'timestamp', readonly: true })
  public readonly updatedAt: Date;
}
