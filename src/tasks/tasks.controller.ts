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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
>>>>>>> 07ef766 (rebased with dev)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
<<<<<<< HEAD
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user, createTaskDto);
=======
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
>>>>>>> 07ef766 (rebased with dev)
  }

  @Get('/task-by-home/:id')
  findAllTaskByHome(@Param('id') id: string) {
<<<<<<< HEAD
    console.log('api call...........')
=======
>>>>>>> 07ef766 (rebased with dev)
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
  @Patch('/task-split-status-update/:id')
  updateTaskSplitStatus(@Request() req, @Param('id') id: string, @Body() taskSplitUpdateDto: UpdateTaskSplitDto) {
    return this.tasksService.updateTaskSplitStatus(+id, taskSplitUpdateDto,req.user);
  }

=======
>>>>>>> 07ef766 (rebased with dev)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
<<<<<<< HEAD

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
  async listByHouse(@Param('house_id') house_id: number) {
    return this.tasksService.listByTaskCategoryByHouse(+house_id);
  }
=======
>>>>>>> 07ef766 (rebased with dev)
}
