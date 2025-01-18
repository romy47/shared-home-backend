import { Injectable, NotFoundException } from '@nestjs/common';
import { House } from '@prisma/client';
import { PrismaService } from 'src/data/services/prisma/prisma.service';

@Injectable()
export class HousesService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: number): Promise<House> {
    const house = await this.prismaService.house.findUnique({
      where: { id },
      include: {
        houseMembers: {
          include: {
            user: true,
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

    if (!house) {
      throw new NotFoundException('House not found');
    }
    return house;
  }
}
