import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRoleEntity } from 'src/users/entities/user.entity';
import { HouseRole } from '../types';

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
    const params = request.params;
    const house_id = params.house_id;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => {
      const house_user: UserRoleEntity = user.house_users.find(
        (ur) => ur.house.id == house_id,
      );
      if (!house_user) {
        return false;
      }
      return house_user.role.role == role;
    });
  }
}
