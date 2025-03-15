import { TaskCategoryDetailDto, TaskDetailDto } from './dto/task-detail.dto';
import { UpdateTaskCategoryDto } from 'src/generated/nestjs-dto/update-taskCategory.dto';
import { PaginationService } from 'src/data/common/pagination-service';
import { PaginationParams } from 'src/data/common/pagination-metadata';
import { CreateTaskCategoryDto, CreateTaskDto } from './dto/create-task.dto';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task, TaskSplitStatus, TaskStatus, User } from '@prisma/client';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { UpdateTaskDto, UpdateTaskSplitDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}
  async create(user: User, createTaskDto: CreateTaskDto) {
    const userId = user.id;

    // Start transaction
    return this.prismaService.$transaction(async (prisma) => {
      // Find the house user for the current user
      const houseUser = await prisma.houseUser.findUnique({
        where: {
          house_id_user_id: {
            house_id: createTaskDto.house_id,
            user_id: userId,
          },
        },
      });

      if (!houseUser) {
        throw new NotFoundException('You are not a house user of this house');
      }

      // Create the new task
      const newTask: Task = await prisma.task.create({
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

      // Fetch all house users for the given user IDs in createTaskDto
      const houseUsers = await prisma.houseUser.findMany({
        where: {
          user_id: {
            in: createTaskDto.user_ids,
          },
          house_id: createTaskDto.house_id,
        },
      });

      if (houseUsers.length !== createTaskDto.user_ids.length) {
        throw new NotFoundException(
          'Some users are not associated with the house',
        );
      }

      // Create TaskSplits for each house user
      const taskSplits = houseUsers.map((hu) => ({
        task_id: newTask.id,
        house_user_id: hu.id,
        status: TaskSplitStatus.PENDING,
      }));

      await prisma.taskSplit.createMany({
        data: taskSplits,
      });

      const detailedTask = await prisma.task.findUnique({
        where: { id: newTask.id },
        include: {
          house: true,
          houseUser: true,
          taskCategory: true,
          recurringTask: true,
          taskSplits: true,
        },
      });

      if (!detailedTask) {
        throw new NotFoundException('Task not found after creation');
      }

      // Map the detailed task to TaskDetailDto
      const taskDetail: TaskDetailDto = {
        id: detailedTask.id,
        created_at: detailedTask.created_at,
        updated_at: detailedTask.updated_at,
        title: detailedTask.title,
        due_date: detailedTask.due_date,
        status: detailedTask.status as string, // Adjust based on your type
        description: detailedTask.description,
        house: detailedTask.house,
        creationHouseUser: detailedTask.houseUser,
        taskCategory: detailedTask.taskCategory,
        recurringTask: detailedTask.recurringTask
          ? detailedTask.recurringTask
          : null,
        taskSplits: detailedTask.taskSplits,
      };

      return taskDetail;
      // return newTask;
    });
  }

  async findAllTaskByHome(houseId: number) {
    console.log('here............');
    const tasks = await this.prismaService.task.findMany({
      where: {
        house_id: houseId,
      },
      include: {
        taskCategory: true,
        houseUser: true, //it is the owner,
        taskSplits: {
          include: {
            houseUser: {
              include: {
                user: true, // Fetch the user details inside houseUser
              },
            },
          },
        },

      },
    });
    console.log('these are the tasks, returned',tasks)
    return tasks;
  }

  async findOne(id: number): Promise<TaskDetailDto> {
    console.log('id is '+id)
    const task = await this.prismaService.task.findUnique({
      where: { id },
      include: {
        house: true,
        taskCategory: true,
        recurringTask: true,
        taskSplits: {
          include:{
            houseUser:{
              include: {
                user: true,  // Add this line to include the user details
              },
            }
          }
        },
        houseUser: {
          include: {
            user: true,  // Add this line to include the user details
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const taskDetail: TaskDetailDto = {
      id: task.id,
      created_at: task.created_at,
      updated_at: task.updated_at,
      title: task.title,
      due_date: task.due_date,
      status: task.status as string, // Enum or string based on your type
      description: task.description,
      house: task.house,
      creationHouseUser: task.houseUser,
      taskCategory: task.taskCategory,
      recurringTask: task.recurringTask ? task.recurringTask : null,
      taskSplits: task.taskSplits,
    };

    return taskDetail;
  }

  //updating the task itself
  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDetailDto> {
    return await this.prismaService.$transaction(async (prisma) => {
      const existingTask = await prisma.task.findUnique({
        where: { id },
        include: {
          taskSplits: true,
        },
      });

      if (!existingTask) {
        throw new NotFoundException('Task not found');
      }

      const houseUserRecords = await prisma.houseUser.findMany({
        where: {
          user_id: { in: updateTaskDto.user_ids },
          house_id: existingTask.house_id,
        },
      });

      const houseUserIds = houseUserRecords.map((record) => record.id);
      const existingHouseUserIds = existingTask.taskSplits.map(
        (split) => split.house_user_id,
      );

      const houseUserIdsToAdd = houseUserIds.filter(
        (id) => !existingHouseUserIds.includes(id),
      );
      const houseUserIdsToRemove = existingHouseUserIds.filter(
        (id) => !houseUserIds.includes(id),
      );
      if (houseUserIdsToAdd.length > 0) {
        await prisma.taskSplit.createMany({
          data: houseUserIdsToAdd.map((houseUserId) => ({
            task_id: id,
            house_user_id: houseUserId,
            status: TaskSplitStatus.PENDING,
          })),
        });
      }
      // Remove TaskSplits for house users no longer in the list
      if (houseUserIdsToRemove.length > 0) {
        await prisma.taskSplit.deleteMany({
          where: {
            task_id: id,
            house_user_id: {
              in: houseUserIdsToRemove,
            },
          },
        });
      }

      await prisma.task.update({
        where: { id },
        data: {
          title: updateTaskDto.title,
          due_date: updateTaskDto.due_date,
          description: updateTaskDto.description,
          task_category_id: updateTaskDto.task_category_id,
          // recurring_task_id: updateTaskDto.recurring_task_id, TODO
        },
      });

      // Fetch the updated task with relations for returning
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          house: true,
          houseUser: true,
          taskCategory: true,
          recurringTask: true,
          taskSplits: true,
        },
      });

      const taskDetail: TaskDetailDto = {
        id: task.id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        title: task.title,
        due_date: task.due_date,
        status: task.status as string, // Enum or string based on your type
        description: task.description,
        house: task.house,
        creationHouseUser: task.houseUser,
        taskCategory: task.taskCategory,
        recurringTask: task.recurringTask ? task.recurringTask : null,
        taskSplits: task.taskSplits,
      };
      return taskDetail;
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    return await this.prismaService.$transaction(async (prisma) => {
      // Check if the task exists
      const existingTask = await prisma.task.findUnique({
        where: { id },
        include: {
          taskSplits: true,
        },
      });

      if (!existingTask) {
        throw new NotFoundException('Task not found');
      }

      // Delete related TaskSplits
      await prisma.taskSplit.deleteMany({
        where: { task_id: id },
      });

      // Delete the task itself
      await prisma.task.delete({
        where: { id },
      });

      return { message: `Task with ID ${id} has been removed successfully` };
    });
  }

  async updateTaskSplitStatus(
    tasksplitId: number,
    updateTaskSplitDto: UpdateTaskSplitDto,
    user: User,
  ): Promise<{ message: string }> {
    console.log('i am called....xxxx')
    return await this.prismaService.$transaction(async (prisma) => {
      const { house_id, task_id, status } = updateTaskSplitDto;

      // Get the HouseUser (the user_id from the authenticated user)
      const houseUser = await prisma.houseUser.findUnique({
        where: {
          house_id_user_id: {
            house_id: house_id,
            user_id: user.id,
          },
        },
      });

      if (!houseUser) {
        throw new NotFoundException('HouseUser not found for this user');
      }

      // Check if the TaskSplit exists for the given task_id, tasksplit_id, and house_user_id
      const taskSplit = await prisma.taskSplit.findUnique({
        where: {
          id: tasksplitId,
        },
        include: {
          task: true, // Include the task to verify task_id and house_id
          houseUser: true, // Include the user to verify house_user_id
        },
      });

      if (!taskSplit) {
        throw new NotFoundException('TaskSplit not found');
      }

      if (
        taskSplit.task_id !== task_id ||
        taskSplit.houseUser.house_id !== house_id
      ) {
        throw new ForbiddenException(
          'This TaskSplit does not belong to the specified task or house',
        );
      }

      // Update the TaskSplit status
      const updatedTaskSplit = await prisma.taskSplit.update({
        where: { id: tasksplitId },
        data: {
          status: status,
        },
      });

      return { message: `TaskSplit status updated to ${status} successfully` };
    });
  }

  async createTaskCategory(
    user: any,
    createTaskCategoryDto: CreateTaskCategoryDto,
  ): Promise<TaskCategoryDetailDto> {
    return this.prismaService.$transaction(async (prisma) => {
      const houseUser = await this.prismaService.houseUser.findUnique({
        where: {
          house_id_user_id: {
            house_id: createTaskCategoryDto.house_id,
            user_id: user.id,
          },
        },
      });

      if (!houseUser) {
        throw new NotFoundException(
          'HouseUser not found for the given house and user.',
        );
      }

      const newTaskCategory = await this.prismaService.taskCategory.create({
        data: {
          house_user_id: houseUser.id,
          house_id: createTaskCategoryDto.house_id,
          image_id: createTaskCategoryDto.image_id,
          title: createTaskCategoryDto.title,
        },
      });

      // Fetch the detailed task category including relations within the same transaction
      const detailedTaskCategory = await prisma.taskCategory.findUnique({
        where: { id: newTaskCategory.id },
        include: {
          house: true,
          user: true, // Assuming this refers to houseUser
          image: true,
        },
      });

      if (!detailedTaskCategory) {
        throw new NotFoundException('TaskCategory not found after creation.');
      }

      // Map the result to the custom DTO
      const taskCategoryDetail: TaskCategoryDetailDto = {
        id: detailedTaskCategory.id,
        title: detailedTaskCategory.title,
        house: detailedTaskCategory.house,
        houseUser: detailedTaskCategory.user,
        image: detailedTaskCategory.image,
        created_at: detailedTaskCategory.created_at,
        updated_at: detailedTaskCategory.updated_at,
      };

      return taskCategoryDetail;
    });
  }
  async updateTaskCategory(
    user: User,
    id: number,
    updateTaskCategoryDto: UpdateTaskCategoryDto,
  ) {
    const taskCategory = await this.prismaService.taskCategory.findUnique({
      where: { id },
    });

    if (!taskCategory) {
      throw new NotFoundException('TaskCategory not found.');
    }

    const houseUser = await this.prismaService.houseUser.findUnique({
      where: {
        house_id_user_id: {
          house_id: taskCategory.house_id,
          user_id: user.id,
        },
      },
    });

    if (!houseUser) {
      throw new ForbiddenException('You do not belong to this house.');
    }

    console.log('printign payload===', updateTaskCategoryDto);
    await this.prismaService.taskCategory.update({
      where: { id },
      data: updateTaskCategoryDto,
    });

    // Fetch the detailed task category including relations within the same transaction
    const detailedTaskCategory =
      await this.prismaService.taskCategory.findUnique({
        where: { id: taskCategory.id },
        include: {
          house: true,
          user: true, // Assuming this refers to houseUser
          image: true,
        },
      });

    if (!detailedTaskCategory) {
      throw new NotFoundException('TaskCategory not found after update.');
    }

    // Map the result to the custom DTO
    const taskCategoryDetail: TaskCategoryDetailDto = {
      id: detailedTaskCategory.id,
      title: detailedTaskCategory.title,
      house: detailedTaskCategory.house,
      houseUser: detailedTaskCategory.user,
      image: detailedTaskCategory.image,
      created_at: detailedTaskCategory.created_at,
      updated_at: detailedTaskCategory.updated_at,
    };

    return taskCategoryDetail;
  }

  async deleteTaskCategory(user: any, id: number) {
    const taskCategory = await this.prismaService.taskCategory.findUnique({
      where: { id },
    });

    if (!taskCategory) {
      throw new NotFoundException('TaskCategory not found.');
    }

    const houseUser = await this.prismaService.houseUser.findUnique({
      where: {
        house_id_user_id: {
          house_id: taskCategory.house_id,
          user_id: user.id,
        },
      },
    });

    if (!houseUser) {
      throw new NotFoundException('You do not belong to this house');
    }

    return this.prismaService.taskCategory.delete({
      where: { id },
    });
  }

  async listByTaskCategoryByHouse(house_id: number) {
    //this type means, the type for creating query that results in a list,
    //it is generated from the prisma models already, for our TaskCategory model
    //prisma generated it for us..
    const query: Prisma.TaskCategoryFindManyArgs = {
      where: { house_id },
      include: {
        house: true,
        user: true,
        image: true,
      },
    };
    const params: PaginationParams = {
      page: 1,
      pageSize: 5,
    };
    return this.paginationService.paginate(
      this.prismaService.taskCategory,
      params,
      query,
    );
  }
}
