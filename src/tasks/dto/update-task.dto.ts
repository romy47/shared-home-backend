import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TaskSplitStatus } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  @IsOptional()
  @IsDateString()
  due_date?: Date | null;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ type: 'integer', nullable: true })
  @IsOptional()
  @IsInt()
  task_category_id?: number;

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

export class UpdateTaskSplitDto {
  @ApiProperty({
    type: 'string',
    enum: TaskSplitStatus,
  })
  @IsEnum(TaskSplitStatus)
  @IsNotEmpty()
  status: TaskSplitStatus;

  @ApiProperty({ type: 'integer', format: 'int32' })
  @IsInt()
  @IsNotEmpty()
  house_id: number;

  @ApiProperty({ type: 'integer', format: 'int32' })
  @IsInt()
  @IsNotEmpty()
  task_id: number;
}
