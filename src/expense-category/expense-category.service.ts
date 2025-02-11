import { Injectable } from '@nestjs/common';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { ExpenseCategory } from '@prisma/client';

@Injectable()
export class ExpenseCategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createExpenseCategoryDto: CreateExpenseCategoryDto, userId: number): Promise<ExpenseCategory> {
    // Validate that the user is logged in and belongs to a house
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { house_users: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.house_users.length === 0) {
      throw new Error('User does not belong to any house');
    }

    const houseId = user.house_users[0].house_id;

    // Validate image_id
    if (createExpenseCategoryDto.image_id) {
      const image = await this.prismaService.imageLibrary.findUnique({
        where: { id: createExpenseCategoryDto.image_id },
      });

      if (!image) {
        throw new Error('Image not found');
      }
    }

    return this.prismaService.expenseCategory.create({
      data: {
        title: createExpenseCategoryDto.title,
        created_by: userId,
        house_id: houseId,
        image_id: createExpenseCategoryDto.image_id || null,
      },
    });
  }

  async delete(id: number): Promise<ExpenseCategory> {
    return this.prismaService.expenseCategory.delete({
      where: { id: Number(id) },
    });
  }

  async findByHouseId(houseId: number): Promise<ExpenseCategory[]> {
    return this.prismaService.expenseCategory.findMany({
      where: { house_id: Number(houseId) },
    });
  }

  async update(id: number, updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<ExpenseCategory> {
    const data: any = {};
    if (updateExpenseCategoryDto.title) {
      data.title = updateExpenseCategoryDto.title;
    }
    if (updateExpenseCategoryDto.imageId !== undefined) {
      if (updateExpenseCategoryDto.imageId) {
        const image = await this.prismaService.imageLibrary.findUnique({
          where: { id: updateExpenseCategoryDto.imageId },
        });

        if (!image) {
          throw new Error('Image not found');
        }
      }
      data.image_id = updateExpenseCategoryDto.imageId || null;
    }
    return this.prismaService.expenseCategory.update({
      where: { id: Number(id) },
      data,
    });
  }
}