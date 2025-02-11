import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { PaginationService } from 'src/data/common/pagination-service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, PaginationService],
=======
=======
>>>>>>> 67de227 (rebased with dev)

@Module({
  controllers: [TasksController],
  providers: [TasksService],
<<<<<<< HEAD
>>>>>>> 07ef766 (rebased with dev)
=======
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { PaginationService } from 'src/data/common/pagination-service';

@Module({
  controllers: [TasksController],
<<<<<<< HEAD
  providers: [TasksService, PrismaService],
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
  providers: [TasksService, PrismaService, PaginationService],
>>>>>>> f2d6a44 (added pagiantion)
=======
>>>>>>> 67de227 (rebased with dev)
})
export class TasksModule {}
