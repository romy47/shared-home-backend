import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsInt()
  house_id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsInt()
  task_category_id: number;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  due_date?: Date | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    type: 'string',
    enum: TaskStatus, 
  })
  @IsEnum(TaskStatus) 
  status: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'integer',
      format: 'int32',
    },
  })
  @IsArray()
  @ArrayMinSize(1) 
  @IsInt({ each: true })
  user_ids: number[];
}

export class CreateTaskCategoryDto {
  house_id: number;
  image_id?: number;
  title: string;
}

