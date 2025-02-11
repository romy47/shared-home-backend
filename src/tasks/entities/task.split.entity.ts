import { ApiProperty } from '@nestjs/swagger';
import { TaskSplit, TaskSplitStatus } from '@prisma/client'; // Import TaskSplitStatus

export class BaseTaskSplitEntity implements TaskSplit {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  task_id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  house_user_id: number;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  recurring_task_id: number | null;

  @ApiProperty({
    type: 'string',
    enum: TaskSplitStatus, 
  })
  status: TaskSplitStatus; 

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

  constructor(data: Partial<BaseTaskSplitEntity>) {
    Object.assign(this, data);
  }
}
