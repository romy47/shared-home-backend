import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  first_name: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  last_name: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  email: string | null;

  @ApiProperty()
  auth_id: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  username: string | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  birthday: Date | null;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  profile_img: number | null;

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

  @Exclude()
  super_admin: boolean;

  constructor(data: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}
