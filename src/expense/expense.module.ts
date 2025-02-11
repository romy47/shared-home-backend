import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { UsersModule } from 'src/users/users.module';
import { DataModule } from 'src/data/data.module';

@Module({
  controllers: [ExpenseController],
  imports: [UsersModule, DataModule],
  providers: [ExpenseService],
  exports: [ExpenseService]
})
export class ExpenseModule {}
