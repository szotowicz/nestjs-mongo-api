export class TaskCreatedDto {
  id: string;

  constructor(taskId: string) {
    this.id = taskId;
  }
}
