import { PrismaClient, User, Role } from '@prisma/client';


export class AuthRepository {

  private prisma: PrismaClient;
  constructor() {
      this.prisma = new PrismaClient();
    }
  // Get user by auth_id
   getUserByAuthId=async(auth_id: string): Promise<User | null>=> {
    return await this.prisma.user.findUnique({
      where: { auth_id },
    });
  }

  // Create a new user
   createUser=async(userData: {
    first_name: string;
    last_name: string;
    email: string;
    auth_id: string;
    birthday: Date | null;
    profile_img:  null;
  }): Promise<User>=> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  // Update user profile by auth_id
   updateUser=async(auth_id: string, userData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    birthday?: Date | null;
    profile_img?: null;
  }): Promise<User>=> {
    return await this.prisma.user.update({
      where: { auth_id },
      data: userData,
    });
  }

  // Get all roles
   getAllRoles=async(): Promise<Role[]>=> {
    return await this.prisma.role.findMany();
  }

  // Create a new role
   createRole=async(roleData: {
    title: string;
    role: string;
  }): Promise<Role>=> {
    return await this.prisma.role.create({
      data: roleData,
    });
  }

  // Get role by ID
   getRoleById=async(id: number): Promise<Role | null>=> {
    return await this.prisma.role.findUnique({
      where: { id },
    });
  }
   findRoleByRoleName=async(role: string)=> {
    return await this.prisma.role.findFirst({
      where: { role },
    });
  }

  // Update role by ID
   updateRole=async(id: number, roleData: {
    title?: string;
    role?: string;
  }): Promise<Role>=> {
    return await this.prisma.role.update({
      where: { id },
      data: roleData,
    });
  }

  // Delete role by ID
   deleteRole=async(id: number): Promise<void>=> {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}

