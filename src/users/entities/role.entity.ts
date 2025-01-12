import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class BaseRoleEntity implements Role {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  title: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  role: string | null;
  constructor(data: Partial<BaseRoleEntity>) {
    Object.assign(this, data);
  }
}
