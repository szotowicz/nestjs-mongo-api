import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Task, TaskStatus } from './model/task.schema';
import { TaskDomain } from './model/task.domain';

@Injectable()
export class QueueService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(): Promise<string> {
    const fileName = uuid();
    // TODO
    const createdTask = await this.taskModel.create({
      _id: fileName,
      status: TaskStatus.TODO,
      details: '',
    });
    return createdTask._id;
  }

  async getTaskById(taskId: string): Promise<TaskDomain> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException({
        en: 'Task with this ID does not exist',
        pl: 'Zadanie z podanym ID nie istnieje',
      });
    }
    return task;
  }
}
