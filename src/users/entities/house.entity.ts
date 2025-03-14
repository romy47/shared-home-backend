import { ApiProperty } from '@nestjs/swagger';
import { House } from '@prisma/client';

export class BaseHouseEntity implements House {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  created_by: number;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  title: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  house_img: number | null;
  @ApiProperty({
    type: 'boolean',
  })
  deleted: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  created_at: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updated_at: Date;
  constructor(data: Partial<BaseHouseEntity>) {
    Object.assign(this, data);
  }
}
