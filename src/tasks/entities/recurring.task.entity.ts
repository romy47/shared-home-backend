import { ApiProperty } from '@nestjs/swagger';
import { RecurringTask } from '@prisma/client';

export class BaseRecurringTaskEntity implements RecurringTask {
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
  })
  schedule_id: number;

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

  constructor(data: Partial<BaseRecurringTaskEntity>) {
    Object.assign(this, data);
  }
}
