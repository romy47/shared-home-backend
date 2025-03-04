import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { BaseUserEntity } from 'src/users/entities/user.entity';
import { HouseRole } from '../types';
import { HouseRoleEntity } from 'src/users/entities/house-role.entity';

@Injectable()
export class HouseRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<HouseRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!(request.params && request.params.house_id)) {
      return false;
    }
    const house_id = request.params.house_id;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => {
      const house_user: HouseRoleEntity = user.house_users.find(
        (ur) => ur.house.id == house_id,
      );
      if (!house_user) {
        return false;
      }
      return house_user.role.role == role;
    });
  }
}
