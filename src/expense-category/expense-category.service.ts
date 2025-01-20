import { Injectable } from '@nestjs/common';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { ExpenseCategory } from '@prisma/client';

@Injectable()
export class ExpenseCategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    return this.prismaService.expenseCategory.create({
      data: {
        title: createExpenseCategoryDto.title,
        created_by: createExpenseCategoryDto.user_id,
        house_id: createExpenseCategoryDto.house_id,
        image_id: createExpenseCategoryDto.image_id,
      },
    });
  }

  async delete(id: number): Promise<ExpenseCategory> {
    return this.prismaService.expenseCategory.delete({
      where: { id },
    });
  }

  async findByHouseId(houseId: number): Promise<ExpenseCategory[]> {
    return this.prismaService.expenseCategory.findMany({
      where: { house_id: houseId },
    });
  }

  async update(id: number, updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<ExpenseCategory> {
    const data: any = {};
    if (updateExpenseCategoryDto.title) {
      data.title = updateExpenseCategoryDto.title;
    }
    if (updateExpenseCategoryDto.imageId) {
      data.image_id = updateExpenseCategoryDto.imageId;
    }
    return this.prismaService.expenseCategory.update({
      where: { id },
      data,
    });
  }
}
