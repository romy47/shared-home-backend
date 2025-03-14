import { ApiProperty } from '@nestjs/swagger';
import { BaseRoleEntity } from './role.entity';
import { BaseUserEntity } from './user.entity';

export class UserRoleEntity {
  @ApiProperty({ type: () => BaseUserEntity })
  user: BaseUserEntity;
  @ApiProperty({ type: () => BaseRoleEntity })
  role: BaseRoleEntity;

  constructor(data: Partial<UserRoleEntity>) {
    this.user = new BaseUserEntity(data?.user || {});
    this.role = new BaseRoleEntity(data?.role || {});
  }
}
