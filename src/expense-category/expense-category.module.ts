import { Module } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { ExpenseCategoryController } from './expense-category.controller';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  controllers: [ExpenseCategoryController],
  providers: [ExpenseCategoryService, PrismaService],
})
export class ExpenseCategoryModule {}
