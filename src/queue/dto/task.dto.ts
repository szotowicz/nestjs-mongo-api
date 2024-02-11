import { TaskDomain } from '../model/task.domain';
import { TaskStatus } from '../model/task.schema';

export class TaskDto {
  id: string;
  status: TaskStatus;
  details?: string; // Defined only if status is "FAILURE"
  createdAt: string;
  updatedAt: string;

  constructor(model: TaskDomain) {
    this.id = model._id;
    this.status = model.status;
    this.details = model.details ? model.details : undefined;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
