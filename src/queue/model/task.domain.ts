import { Task } from './task.schema';

export class TaskDomain extends Task {
  createdAt?: string;
  updatedAt?: string;
}
