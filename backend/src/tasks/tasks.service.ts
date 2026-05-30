import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityGateway } from '../gateway/activity.gateway';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService, private activityGateway: ActivityGateway) {}

  private async requireWorkspaceAccess(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });
    if (!task) throw new NotFoundException('Task not found');

    const membership = await this.prisma.workspaceMembership.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: task.project.workspaceId } },
    });
    if (!membership) {
      throw new ForbiddenException('Access denied to task workspace');
    }
    return { task, membership };
  }

  async create(userId: string, dto: { boardId: string; title: string; description?: string; assigneeId?: string; dueDate?: string }) {
    const board = await this.prisma.board.findUnique({ where: { id: dto.boardId }, include: { project: true } });
    if (!board) throw new NotFoundException('Board not found');
    const membership = await this.prisma.workspaceMembership.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: board.project.workspaceId } },
    });
    if (!membership) {
      throw new ForbiddenException('Workspace access required');
    }

    const task = await this.prisma.task.create({
      data: {
        boardId: dto.boardId,
        projectId: board.projectId,
        title: dto.title,
        description: dto.description,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });

    this.activityGateway.broadcastEvent('task.created', {
      taskId: task.id,
      projectId: board.projectId,
      boardId: dto.boardId,
      title: task.title,
    });

    return task;
  }

  async move(userId: string, taskId: string, boardId: string, order: number) {
    const { task } = await this.requireWorkspaceAccess(taskId, userId);
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board || board.projectId !== task.projectId) {
      throw new BadRequestException('Invalid board destination');
    }
    const movedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { boardId, updatedAt: new Date() },
    });

    this.activityGateway.broadcastEvent('task.moved', {
      taskId: movedTask.id,
      boardId,
      projectId: movedTask.projectId,
    });

    return movedTask;
  }

  async update(userId: string, taskId: string, dto: { title?: string; description?: string; status?: string; priority?: string; dueDate?: string; assigneeId?: string }) {
    await this.requireWorkspaceAccess(taskId, userId);
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status as any,
        priority: dto.priority as any,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: dto.assigneeId,
      },
    });

    this.activityGateway.broadcastEvent('task.updated', {
      taskId: updatedTask.id,
      projectId: updatedTask.projectId,
      status: updatedTask.status,
    });

    return updatedTask;
  }

  async addComment(userId: string, taskId: string, content: string) {
    const { task } = await this.requireWorkspaceAccess(taskId, userId);
    const comment = await this.prisma.comment.create({
      data: {
        taskId,
        userId,
        content,
      },
    });

    this.activityGateway.broadcastEvent('task.comment', {
      taskId,
      commentId: comment.id,
      content: comment.content,
    });

    return comment;
  }
}
