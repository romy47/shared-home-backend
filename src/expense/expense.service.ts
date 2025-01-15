import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from '@prisma/client';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}
  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // create the expense
    return await this.prismaService.expense.create({
      data: {
        ...createExpenseDto,
        amount: new Prisma.Decimal(createExpenseDto.amount),
        user: {
          connect: { id: Number(createExpenseDto.userId) },
        },
        house: {
          connect: { id: Number(createExpenseDto.houseId) },
        },
        expenseCategory: {
          connect: { id: Number(createExpenseDto.expenseCategoryId) },
        },
      },
    });
  }

  async findAll(): Promise<Expense[]> {
    return this.prismaService.expense.findMany();
  }

  findByUserId(userId: number) {
    return this.prismaService.expense.findMany({
      where: { house_user_id: userId },
    });
  }

  findByHouseId(houseId: number) {
    return this.prismaService.expense.findMany({
      where: { house_id: houseId },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} expense`;
  // }

  // update(id: number, updateExpenseDto: UpdateExpenseDto) {
  //   return `This action updates a #${id} expense`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} expense`;
  // }

  async removeByUserId(userId: number) {
    return this.prismaService.expense.deleteMany({
      where: { house_user_id: userId },
    });
  }
}
