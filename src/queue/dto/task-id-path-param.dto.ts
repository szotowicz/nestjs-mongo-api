import { IsNotEmpty, IsUUID } from 'class-validator';

export class taskIdPathParam {
  @IsUUID('4')
  @IsNotEmpty()
  taskId: string;
}
