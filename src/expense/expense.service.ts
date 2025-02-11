import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, ExpenseSplitStatus } from '@prisma/client';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = await this.prismaService.expense.create({
      data: {
        amount: createExpenseDto.amount,
        currency: createExpenseDto.currency,
        title: createExpenseDto.title,
        house_user_id: createExpenseDto.userId,
        house_id: createExpenseDto.houseId,
        expense_category_id: createExpenseDto.expenseCategoryId,
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

  // async findAll(): Promise<Expense[]> {
  //   return this.prismaService.expense.findMany();
  // }

  // findByUserId(userId: number) {
  //   return this.prismaService.expense.findMany({
  //     where: { house_user_id: userId },
  //   });
  // }

  // findByHouseId(houseId: number) {
  //   return this.prismaService.expense.findMany({
  //     where: { house_id: houseId },
  //   });
  // }

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
