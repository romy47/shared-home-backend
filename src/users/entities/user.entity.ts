import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { HouseRoleEntity } from './house-role.entity';

export class BaseUserEntity implements User {
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
  @Exclude()
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

  @Exclude()
  deleted: boolean;

  constructor(data: Partial<BaseUserEntity>) {
    Object.assign(this, data);
  }
}

export class UserDetailEntity extends BaseUserEntity {
  @ApiProperty({ type: HouseRoleEntity })
  house_users: HouseRoleEntity[] = [];

  constructor(data: Partial<UserDetailEntity>) {
    super(data);
    data?.house_users?.forEach((hu) => {
      this.house_users.push(new HouseRoleEntity(hu));
    });
  }
}
