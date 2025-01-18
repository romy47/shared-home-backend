import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}
  async create(createTaskDto: CreateTaskDto) {
    const userId; //TODO will come req.user
    const houseUser = await this.prismaService.houseUser.findUnique({
      where: {
        house_id_user_id: {
          house_id: createTaskDto.house_id,
          user_id: userId,
        },
      },
    });
    if (!houseUser) {
      throw new NotFoundException('HouseUser not found'); //TODO 
    }

    const newTask = await this.prismaService.task.create({
      data: {
        house_user_id: houseUser.id, 
        house_id: createTaskDto.house_id,
        task_category_id: createTaskDto.task_category_id,
        title: createTaskDto.title,
        due_date: createTaskDto.due_date,
        status: createTaskDto.status as TaskStatus, 
        description: createTaskDto.description,
      },
    });
    return newTask;

  }

  async findAllTaskByHome(houseId: number) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        house_id: houseId,
      },
      include: {
        taskCategory: true, // Optionally include related task category data
        houseUser: true, // Optionally include user data related to the task
      },
    });
    
    return tasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
