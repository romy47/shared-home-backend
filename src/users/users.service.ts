import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      throw new UnprocessableEntityException('User already exists');
    }

    // Create the user
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
