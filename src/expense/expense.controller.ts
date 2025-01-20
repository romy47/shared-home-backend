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
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<ExpenseBaseEntity> {
    const expense = await this.expenseService.create(createExpenseDto);
    return new ExpenseBaseEntity(expense);
  }

  // @Get()
  // @ApiOkResponse({ type: [ExpenseBaseEntity] })
  // async findAll(): Promise<ExpenseBaseEntity[]> {
  //   const expenses = await this.expenseService.findAll();
  //   return expenses.map(expense => new ExpenseBaseEntity(expense));
  // }

  // @Get('user/:userId')
  // findByUserId(@Param('userId') userId: number) {
  //   return this.expenseService.findByUserId(userId);
  // }

  // @Get('house/:houseId')
  // findByHouseId(@Param('houseId') houseId: number) {
  //   return this.expenseService.findByHouseId(houseId);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.expenseService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
  //   return this.expenseService.update(+id, updateExpenseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.expenseService.remove(+id);
  // }

  @Delete('user/:userId')
  removeByUserId(@Param('userId') userId: number) {
    return this.expenseService.removeByUserId(userId);
  }
}
