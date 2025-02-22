import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ExpenseBaseEntity } from './entities/expense.entity';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOkResponse({})
  async create(@Body() createExpenseDto: CreateExpenseDto, @Query('userId') userId: number): Promise<ExpenseBaseEntity> {
    const expense = await this.expenseService.create(createExpenseDto, userId);
    return new ExpenseBaseEntity(expense);
  }

  @Get('user/:userId')
  @ApiOkResponse({ type: [ExpenseBaseEntity] })
  async findByUserId(@Param('userId') userId: number): Promise<ExpenseBaseEntity[]> {
    const expenses = await this.expenseService.findByUserId(userId);
    return expenses.map(expense => new ExpenseBaseEntity(expense));
  }

  @Get('house/:houseId')
  @ApiOkResponse({ type: [ExpenseBaseEntity] })
  async findByHouseId(@Param('houseId') houseId: number): Promise<ExpenseBaseEntity[]> {
    const expenses = await this.expenseService.findByHouseId(houseId);
    return expenses.map(expense => new ExpenseBaseEntity(expense));
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto): Promise<ExpenseBaseEntity> {
    const expense = await this.expenseService.update(id, updateExpenseDto);
    return new ExpenseBaseEntity(expense);
  }

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<ExpenseBaseEntity> {
    const expense = await this.expenseService.removeById(id);
    return new ExpenseBaseEntity(expense);
  }

  @Delete('user/:userId')
  removeByUserId(@Param('userId') userId: number) {
    return this.expenseService.removeByUserId(userId);
  }
}
