import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { BaseHouseEntity } from './house.entity';
import { BaseRoleEntity } from './role.entity';

export class UserBaseEntity implements User {
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

  @Exclude()
  deleted: boolean;

  constructor(data: Partial<UserBaseEntity>) {
    Object.assign(this, data);
  }
}

class houseUserEntity {
  @ApiProperty()
  house: BaseHouseEntity;
  @ApiProperty()
  role: BaseRoleEntity;

  constructor(data: Partial<houseUserEntity>) {
    this.house = new BaseHouseEntity(data?.house || {});
    this.role = new BaseRoleEntity(data?.role || {});
  }
}

export class UserDetailEntity extends UserBaseEntity {
  @ApiProperty({ type: houseUserEntity })
  house_users: houseUserEntity[] = [];

  constructor(data: Partial<UserDetailEntity>) {
    super(data);
    data?.house_users?.forEach((hu) => {
      this.house_users.push(new houseUserEntity(hu));
    });
  }
}
