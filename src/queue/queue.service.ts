import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Queue } from 'bull';
import * as fs from 'fs';
import readXlsxFile, { Row } from 'read-excel-file/node';
import { TASKS_QUEUE } from '../constants';
import { TaskDomain } from './model/task.domain';
import { Task, TaskStatus } from './model/task.schema';
import { Reservation } from './model/reservation.schema';
import { ReservationParsed } from './model/reservation';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  constructor(
    @InjectQueue(TASKS_QUEUE) private readonly taskQueue: Queue,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Reservation.name) private readonly reservationModel: Model<Reservation>,
  ) {}

  async createTask(filePath: string): Promise<string> {
    const taskId = uuid();
    await this.taskQueue.add({ id: taskId });
    await this.taskModel.create({
      _id: taskId,
      filePath,
      status: TaskStatus.TODO,
      details: '',
    });
    return taskId;
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

  async processFile(taskId: string): Promise<void> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      this.logger.error(`Task with ID "${taskId}" does not exist`);
      return;
    }

    this.logger.log(`Start processing file: ${task.filePath}`);
    if (!fs.existsSync(task.filePath)) {
      await this.taskModel.updateOne(
        { _id: taskId },
        { status: TaskStatus.FAILURE, details: 'The uploaded file does not exist' },
      );
      return;
    }

    try {
      const rows = await readXlsxFile(task.filePath);
      await this.insert(taskId, rows);
      this.logger.log(`File processing completed: ${task.filePath}`);
    } catch (error) {
      this.logger.error(`File processing failed. Reason: ${error}`);
      await this.taskModel.updateOne(
        { _id: taskId },
        { status: TaskStatus.FAILURE, details: 'File processing failed' },
      );
    }
  }

  private async insert(taskId: string, rows: Row[]): Promise<void> {
    if (rows.length < 3) {
      await this.taskModel.updateOne(
        { _id: taskId },
        { status: TaskStatus.FAILURE, details: 'The uploaded file was empty' },
      );
      return;
    }

    let created = 0;
    let updated = 0;
    let failed = 0;
    for await (const row of rows.slice(2)) {
      const reservationParsed = ReservationParsed.parse(row);
      if (!reservationParsed) {
        this.logger.log(`Invalid: ${JSON.stringify(row, null, 2)}`);
        failed++;
        continue;
      }
      const updatedRecord = await this.reservationModel.findOneAndUpdate(
        { _id: reservationParsed._id },
        reservationParsed,
        { upsert: true },
      );
      if (updatedRecord) {
        updated++;
        this.logger.log(`Updated: ${reservationParsed._id}`);
      } else {
        created++;
        this.logger.log(`Created: ${reservationParsed._id}`);
      }
    }
    await this.taskModel.updateOne(
      { _id: taskId },
      {
        status: TaskStatus.SUCCESS,
        details: `File processing completed. Created: ${created}. Updated: ${updated}. Incorrect and skipped records: ${failed}`,
      },
    );
  }
}
