import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if the user already exists
    console.log(createUserDto);
    const existingUser = await this.prismaService.user.findUnique({
      where: { auth_id: createUserDto.auth_id },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create the user
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        house_users: {
          include: {
            house: true,
            role: true,
          },
          omit: {
            role_id: true,
            house_id: true,
            user_id: true,
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByAuthId(authId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { auth_id: authId },
      include: {
        house_users: {
          include: {
            house: true,
            role: true,
          },
          omit: {
            role_id: true,
            house_id: true,
            user_id: true,
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
