import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

@Schema({ collection: 'tasks', timestamps: true })
export class Task {
  @Prop()
  _id: string;

  @Prop()
  filePath: string;

  @Prop({ enum: TaskStatus })
  status: TaskStatus;

  @Prop()
  details: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
