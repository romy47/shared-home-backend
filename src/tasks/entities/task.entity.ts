import { ApiProperty } from '@nestjs/swagger';
import { Task, TaskStatus } from '@prisma/client';

export class BaseTaskEntity implements Task {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  house_user_id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  house_id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  task_category_id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  recurring_task_id: number | null;

  @ApiProperty({
    type: 'string',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  due_date: Date | null;

  @ApiProperty({
    type: 'string',
    enum: TaskStatus
  })
  status: TaskStatus; 

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updated_at: Date;

  constructor(data: Partial<BaseTaskEntity>) {
    Object.assign(this, data);
  }
}
