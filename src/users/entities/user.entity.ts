import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
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

  constructor(data: Partial<UserBaseEntity>) {
    Object.assign(this, data);
  }
}

export class UserRoleEntity {
  @ApiProperty()
  user: UserBaseEntity;
  @ApiProperty()
  role: BaseRoleEntity;

  constructor(data: Partial<UserRoleEntity>) {
    this.user = new UserBaseEntity(data?.user || {});
    this.role = new BaseRoleEntity(data?.role || {});
  }
}

export class UserDetailEntity extends UserBaseEntity {
  @ApiProperty({ type: UserRoleEntity })
  house_users: UserRoleEntity[] = [];

  constructor(data: Partial<UserDetailEntity>) {
    super(data);
    data?.house_users?.forEach((hu) => {
      this.house_users.push(new UserRoleEntity(hu));
    });
  }
}
