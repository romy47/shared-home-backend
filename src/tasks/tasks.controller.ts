<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskCategoryDto, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskSplitDto } from './dto/update-task.dto';
import { Public } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTaskCategoryDto } from 'src/generated/nestjs-dto/update-taskCategory.dto';
import { TaskCategoryDetailDto } from './dto/task-detail.dto';

@Controller('tasks')
@ApiBearerAuth('access-token')
=======
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req } from '@nestjs/common';
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
import { TasksService } from './tasks.service';
import { CreateTaskCategoryDto, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskSplitDto } from './dto/update-task.dto';
import { Public } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTaskCategoryDto } from 'src/generated/nestjs-dto/update-taskCategory.dto';
import { TaskCategoryDetailDto } from './dto/task-detail.dto';

@Controller('tasks')
<<<<<<< HEAD
>>>>>>> 07ef766 (rebased with dev)
=======
@ApiBearerAuth('access-token')
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req } from '@nestjs/common';
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
import { TasksService } from './tasks.service';
import { CreateTaskCategoryDto, CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskSplitDto } from './dto/update-task.dto';
import { Public } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTaskCategoryDto } from 'src/generated/nestjs-dto/update-taskCategory.dto';
import { TaskCategoryDetailDto } from './dto/task-detail.dto';

@Controller('tasks')
<<<<<<< HEAD
>>>>>>> 67de227 (rebased with dev)
=======
@ApiBearerAuth('access-token')
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user, createTaskDto);
=======
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
>>>>>>> 07ef766 (rebased with dev)
=======
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user, createTaskDto);
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
>>>>>>> 67de227 (rebased with dev)
=======
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user, createTaskDto);
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
  }

  @Get('/task-by-home/:id')
  findAllTaskByHome(@Param('id') id: string) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    console.log('api call...........')
=======
>>>>>>> 07ef766 (rebased with dev)
=======
    console.log('api call...........')
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
>>>>>>> 67de227 (rebased with dev)
=======
    console.log('api call...........')
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
    return this.tasksService.findAllTaskByHome(parseInt(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
  @Patch('/task-split-status-update/:id')
  updateTaskSplitStatus(@Request() req, @Param('id') id: string, @Body() taskSplitUpdateDto: UpdateTaskSplitDto) {
    return this.tasksService.updateTaskSplitStatus(+id, taskSplitUpdateDto,req.user);
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 07ef766 (rebased with dev)
=======
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
>>>>>>> 67de227 (rebased with dev)
=======
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)

  @Post('/task-category')
  async createTaskCategory(@Request() req, @Body() createTaskCategoryDto: CreateTaskCategoryDto) {
    const user = req.user;
    return this.tasksService.createTaskCategory(user, createTaskCategoryDto);
  }

  @Patch('/task-category/:id')
  async updateTaskCategory(@Request() req, @Param('id') id: number, @Body() updateTaskCategoryDto: UpdateTaskCategoryDto) {
    const user = req.user;
    return this.tasksService.updateTaskCategory(user, +id, updateTaskCategoryDto);
  }

  @Delete('/task-category/:id')
  async delete(@Request() req, @Param('id') id: number) {
    const user = req.user;
    return this.tasksService.deleteTaskCategory(user, +id);
  }

  @Get('/taskcategory-by-house/:house_id')
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  async listByHouse(@Param('house_id') house_id: number) {
    return this.tasksService.listByTaskCategoryByHouse(+house_id);
  }
=======
>>>>>>> 07ef766 (rebased with dev)
=======
  async listByHouse(@Param('house_id') house_id: number): Promise<TaskCategoryDetailDto[]> {
    return this.tasksService.listByTaskCategoryByHouse(house_id);
=======
  async listByHouse(@Param('house_id') house_id: number) {
    return this.tasksService.listByTaskCategoryByHouse(+house_id);
>>>>>>> f2d6a44 (added pagiantion)
  }
>>>>>>> e77c486 (CREATE TASK ,TASK CATEGORY APIS)
=======
>>>>>>> 67de227 (rebased with dev)
=======
  async listByHouse(@Param('house_id') house_id: number): Promise<TaskCategoryDetailDto[]> {
    return this.tasksService.listByTaskCategoryByHouse(house_id);
  }
>>>>>>> 6fccb97 (CREATE TASK ,TASK CATEGORY APIS)
}
