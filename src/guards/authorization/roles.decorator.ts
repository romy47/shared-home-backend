import { SetMetadata } from '@nestjs/common';
import { HouseRole } from '../types';

// This decorator works with RolesGuard. Add these two together to protect an API endpoint with defined roles.
// Make sure some where (either in parent or in the current function) there is a param named 'house_id'
//
//   Example:
//   @Get(':house_id')
//   @UseGuards(RolesGuard)
//   @HouseRoles(HouseRole.TENANT, HouseRole.ADMIN)
export const ROLES_KEY = 'roles';
export const HouseRoles = (...roles: HouseRole[]) =>
  SetMetadata(ROLES_KEY, roles);
