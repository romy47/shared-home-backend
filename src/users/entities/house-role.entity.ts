import { ApiProperty } from '@nestjs/swagger';
import { BaseHouseEntity } from './house.entity';
import { BaseRoleEntity } from './role.entity';

export class HouseRoleEntity {
  @ApiProperty({ type: () => BaseHouseEntity })
  house: BaseHouseEntity;
  @ApiProperty({ type: () => BaseRoleEntity })
  role: BaseRoleEntity;

  constructor(data: Partial<HouseRoleEntity>) {
    this.house = new BaseHouseEntity(data?.house || {});
    this.role = new BaseRoleEntity(data?.role || {});
  }
}
