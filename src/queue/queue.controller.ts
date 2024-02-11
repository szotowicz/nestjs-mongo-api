import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { taskIdPathParam } from './dto/task-id-path-param.dto';
import { TaskCreatedDto } from './dto/task-created.dto';
import { TaskDto } from './dto/task.dto';

@Controller('/api/v1/')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('/queue')
  @ApiOperation({ tags: ['Queue'] })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: TaskCreatedDto })
  @UseInterceptors(FileInterceptor('file'))
  async createTask(@UploadedFile() file: Express.Multer.File): Promise<TaskCreatedDto> {
    console.log(file);
    // TODO
    const taskId = await this.queueService.createTask();
    return new TaskCreatedDto(taskId);
  }

  @Get('/queue/:taskId')
  @ApiOperation({ tags: ['Queue'] })
  @ApiOkResponse({ type: TaskDto })
  async getTaskById(@Param() params: taskIdPathParam): Promise<TaskDto> {
    const task = await this.queueService.getTaskById(params.taskId);
    return new TaskDto(task);
  }
}
