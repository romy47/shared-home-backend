import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
<<<<<<< HEAD
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
=======
import { PrismaService } from 'src/data/services/prisma/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
})
export class TasksModule {}
