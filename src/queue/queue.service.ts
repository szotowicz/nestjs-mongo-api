import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import readXlsxFile, { Row } from 'read-excel-file/node';
import { Task, TaskStatus } from './model/task.schema';
import { TaskDomain } from './model/task.domain';
import { Reservation } from './model/reservation.schema';
import { ReservationParsed } from './model/reservation';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Reservation.name) private readonly reservationModel: Model<Reservation>,
  ) {}

  async createTask(filePath: string): Promise<string> {
    const createdTask = await this.taskModel.create({
      _id: uuid(),
      filePath,
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

  async insert(taskId: string, rows: Row[]): Promise<void> {
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
        console.log('Invalid:', row);
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
        console.log('Updated:', reservationParsed._id);
      } else {
        created++;
        console.log('Created:', reservationParsed._id);
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

  async processFile(taskId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    console.log(`Start processing file: ${task.filePath}`);
    if (!fs.existsSync(task.filePath)) {
      await this.taskModel.updateOne(
        { _id: taskId },
        { status: TaskStatus.FAILURE, details: 'The uploaded file does not exist' },
      );
      return;
    }

    await this.taskModel.updateOne({ _id: taskId }, { status: TaskStatus.IN_PROGRESS });
    try {
      const rows = await readXlsxFile(task.filePath);
      await this.insert(taskId, rows);
      console.log(`File processing completed: ${task.filePath}`);
    } catch (error) {
      console.error(`File processing failed. Reason: ${error}`);
      await this.taskModel.updateOne(
        { _id: taskId },
        { status: TaskStatus.FAILURE, details: 'File processing failed' },
      );
    }
  }
}
