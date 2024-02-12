import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { TASKS_QUEUE } from '../constants';
import { QueueService } from './queue.service';
import { TasksProcessor } from './queue.processor';
import { QueueController } from './queue.controller';
import { Task, TaskSchema } from './model/task.schema';
import { Reservation, ReservationSchema } from './model/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    BullModule.registerQueue({ name: TASKS_QUEUE }),
  ],
  providers: [QueueService, TasksProcessor],
  controllers: [QueueController],
})
export class QueueModule {}
