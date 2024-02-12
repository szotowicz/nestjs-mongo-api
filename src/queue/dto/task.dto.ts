import { ApiProperty } from '@nestjs/swagger';
import { TaskDomain } from '../model/task.domain';
import { TaskStatus } from '../model/task.schema';

export class TaskDto {
  @ApiProperty()
  id: string;
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;
  @ApiProperty({ description: 'Defined only if status is "SUCCESS" or "FAILURE"', required: false })
  details?: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;

  constructor(model: TaskDomain) {
    this.id = model._id;
    this.status = model.status;
    this.details = model.details ? model.details : undefined;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
