import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { Task, TaskSchema } from './model/task.schema';
import { Reservation, ReservationSchema } from './model/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}
