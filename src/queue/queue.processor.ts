import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'bull';
import { TASKS_QUEUE } from '../constants';
import { QueueService } from './queue.service';
import { Task, TaskStatus } from './model/task.schema';

@Processor(TASKS_QUEUE)
export class TasksProcessor {
  private readonly logger = new Logger(TasksProcessor.name);
  constructor(
    private readonly queueService: QueueService,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  @Process()
  async handleTask(job: Job) {
    const id = job.data?.id;
    this.logger.log(`Start processing task: ${id}`);
    await this.testDelay();
    await this.taskModel.updateOne({ _id: id }, { status: TaskStatus.IN_PROGRESS });
    await this.testDelay();
    await this.queueService.processFile(id);
    this.logger.log(`Completed processing task: ${id}`);
  }

  private async testDelay(ms = 10000): Promise<void> {
    // Delay for better simulations and tests locally
    this.logger.log('Delay start');
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
    this.logger.log('Delay end');
  }
}
