import { ApiProperty } from "@nestjs/swagger";
import { ImageLibrary } from "@prisma/client";
import { HouseDto } from "src/generated/nestjs-dto/house.dto";
import { HouseUserDto } from "src/generated/nestjs-dto/houseUser.dto";
import { RecurringTaskDto } from "src/generated/nestjs-dto/recurringTask.dto";
import { TaskCategoryDto } from "src/generated/nestjs-dto/taskCategory.dto";
import { TaskSplit } from "src/generated/nestjs-dto/taskSplit.entity";

export class TaskSplitDto {
    @ApiProperty({ type: 'integer' })
    id: number;
  
    @ApiProperty({ type: 'string', format: 'date-time' })
    created_at: Date;
  
    @ApiProperty({ type: 'string', format: 'date-time' })
    updated_at: Date;
  
    @ApiProperty({ type: 'integer' })
    task_id: number;
  
    @ApiProperty({ type: 'integer' })
    house_user_id: number;
  
    @ApiProperty({ type: 'string' })
    status: TaskSplit; // Enum type for status
}

export class TaskDetailDto {
    @ApiProperty({ type: 'integer' })
    id: number;
  
    @ApiProperty({ type: 'string', format: 'date-time' })
    created_at: Date;
  
    @ApiProperty({ type: 'string', format: 'date-time' })
    updated_at: Date;
  
    @ApiProperty({ type: 'string' })
    title: string;
  
    @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
    due_date: Date | null;
  
    @ApiProperty({ type: 'string' })
    status: string; // Enum type for TaskStatus
  
    @ApiProperty({ type: 'string', nullable: true })
    description: string | null;
  
    @ApiProperty({ type: HouseDto })
    house: HouseDto;
  
    @ApiProperty({ type: HouseUserDto })
    creationHouseUser: HouseUserDto;
  
    @ApiProperty({ type: TaskCategoryDto })
    taskCategory: TaskCategoryDto;
  
    @ApiProperty({ type: RecurringTaskDto, nullable: true })
    recurringTask: RecurringTaskDto | null;
  
    @ApiProperty({ type: [TaskSplit] })
    taskSplits: TaskSplit[];
  }

  export class TaskCategoryDetailDto {
    id: number;
    title: string;
    house: HouseDto;
    houseUser: HouseUserDto;
    image?: ImageLibrary
    created_at: Date;
    updated_at: Date;
  }