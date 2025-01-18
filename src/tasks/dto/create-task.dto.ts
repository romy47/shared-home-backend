import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNotEmpty,
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
}
