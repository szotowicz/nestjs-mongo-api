import { Controller, Get, Param, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
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
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './upload',
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createTask(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
  ): Promise<TaskCreatedDto> {
    const taskId = await this.queueService.createTask(file.path);
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
