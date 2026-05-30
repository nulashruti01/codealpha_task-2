import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';

class CreateTaskDto {
  boardId!: string;
  title!: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
}

class MoveTaskDto {
  boardId!: string;
  order!: number;
}

class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}

class AddCommentDto {
  content!: string;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, dto);
  }

  @Patch(':id/move')
  async move(@Req() req: any, @Param('id') id: string, @Body() dto: MoveTaskDto) {
    return this.tasksService.move(req.user.id, id, dto.boardId, dto.order);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user.id, id, dto);
  }

  @Post(':id/comments')
  async addComment(@Req() req: any, @Param('id') id: string, @Body() dto: AddCommentDto) {
    return this.tasksService.addComment(req.user.id, id, dto.content);
  }
}
