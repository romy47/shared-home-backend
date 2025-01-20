import { Controller, Post, Body, Delete, Param, Get, Put, Patch } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';

@Controller('expense-category')
export class ExpenseCategoryController {
  constructor(private readonly expenseCategoryService: ExpenseCategoryService) {}

    @Post()
    @ApiOkResponse({ })
    async create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
        return this.expenseCategoryService.create(createExpenseCategoryDto);
    }

    @Delete(':id')
    @ApiOkResponse({})
    async delete(@Param('id') id: number): Promise<ExpenseCategory> {
        return this.expenseCategoryService.delete(id);
    }

    @Get(':houseId')
    @ApiOkResponse({})
    async findByHouseId(@Param('houseId') houseId: number): Promise<ExpenseCategory[]> {
        return this.expenseCategoryService.findByHouseId(houseId);
    }

    @Patch(':id')
    @ApiOkResponse({})
    async update(@Param('id') id: number, @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<ExpenseCategory> {
        return this.expenseCategoryService.update(id, updateExpenseCategoryDto);
    }
}