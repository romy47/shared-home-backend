import { Controller, Post, Body, Req, Delete, Param, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExpenseCategoryService } from './expense-category.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { ExpenseCategory } from '@prisma/client';
import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('expense-category')
@ApiBearerAuth('access-token')
export class ExpenseCategoryController {
  constructor(private readonly expenseCategoryService: ExpenseCategoryService) {}

  @Post()
  @ApiOkResponse({ description: 'Expense category created successfully.' })
  async create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto, @Req() req: CustomRequest): Promise<ExpenseCategory> {
    const userId = req.user.id;
    return this.expenseCategoryService.create(createExpenseCategoryDto, userId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Expense category deleted successfully.' })
  async delete(@Param('id') id: number): Promise<ExpenseCategory> {
    return this.expenseCategoryService.delete(Number(id));
  }

  @Get('house/:houseId')
  @ApiOkResponse({ description: 'Expense categories retrieved successfully.' })
  async findByHouseId(@Param('houseId') houseId: number): Promise<ExpenseCategory[]> {
    return this.expenseCategoryService.findByHouseId(houseId);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Expense category updated successfully.' })
  async update(@Param('id') id: number, @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<ExpenseCategory> {
    return this.expenseCategoryService.update(id, updateExpenseCategoryDto);
  }
}