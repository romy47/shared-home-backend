import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, ExpenseSplitStatus } from '@prisma/client';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number): Promise<Expense> {
    const user = await this.prismaService.houseUser.findUnique({
      where: { id: userId },
    });

    const expenseCategory = await this.prismaService.expenseCategory.findFirst({
      where: { title: createExpenseDto.expenseCategoryName },
    });

    const expense = await this.prismaService.expense.create({
      data: {
        amount: createExpenseDto.amount,
        currency: createExpenseDto.currency,
        title: createExpenseDto.title,
        house_user_id: user.id,
        house_id: user.house_id,
        expense_category_id: expenseCategory.id,
      },
    });

    const expenseSplits = createExpenseDto.participants.map(participant => ({
      expense_id: expense.id,
      house_user_id: participant.userId,
      amount: new Prisma.Decimal(participant.paid),
      amount_due: new Prisma.Decimal(participant.due),
      status: participant.due < participant.paid ? ExpenseSplitStatus.OWED : ExpenseSplitStatus.SETTLED,
    }));

    await this.prismaService.expenseSplit.createMany({
      data: expenseSplits,
    });

    return expense;
  }

  async findByHouseId(houseId: number): Promise<Expense[]> {
    return this.prismaService.expense.findMany({
      where: { house_id: houseId },
    });
  }

  async findByUserId(userId: number): Promise<Expense[]> {
    return this.prismaService.expense.findMany({
      where: { house_user_id: userId },
    });
  }

  async update(expenseId: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expenseCategory = await this.prismaService.expenseCategory.findFirst({
      where: { title: updateExpenseDto.expenseCategoryName },
    });

    return this.prismaService.expense.update({
      where: { id: expenseId },
      data: {
        amount: updateExpenseDto.amount,
        currency: updateExpenseDto.currency,
        title: updateExpenseDto.title,
        expense_category_id: expenseCategory.id,
      },
    });
  }

  async removeById(expenseId: number): Promise<Expense> {
    return this.prismaService.expense.delete({
      where: { id: expenseId },
    });
  }

  async removeByUserId(userId: number) {
    return this.prismaService.expense.deleteMany({
      where: { house_user_id: userId },
    });
  }
}
