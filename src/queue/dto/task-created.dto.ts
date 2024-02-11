import { ApiProperty } from '@nestjs/swagger';

export class TaskCreatedDto {
  @ApiProperty()
  id: string;

  constructor(taskId: string) {
    this.id = taskId;
  }
}
