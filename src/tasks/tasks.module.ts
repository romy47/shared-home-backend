import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
<<<<<<< HEAD
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { PaginationService } from 'src/data/common/pagination-service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, PaginationService],
=======

@Module({
  controllers: [TasksController],
  providers: [TasksService],
>>>>>>> 07ef766 (rebased with dev)
})
export class TasksModule {}
