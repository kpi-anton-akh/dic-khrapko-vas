import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ObjectIdDto {
  @IsMongoId()
  @ApiProperty({ type: String })
  public readonly id: string;
}
