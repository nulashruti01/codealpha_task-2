import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProjectStatus, TaskPriority } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private async requireMembership(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMembership.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!membership) {
      throw new ForbiddenException('Workspace access required');
    }
    return membership;
  }

  async create(userId: string, dto: { title: string; description?: string; workspaceId: string; status?: ProjectStatus; priority?: TaskPriority; startDate?: string; dueDate?: string; budget?: number; client?: string; tags?: string[] }) {
    await this.requireMembership(dto.workspaceId, userId);
    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        workspaceId: dto.workspaceId,
        ownerId: userId,
        status: dto.status ?? ProjectStatus.PLANNED,
        priority: dto.priority ?? TaskPriority.MEDIUM,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        budget: dto.budget,
        client: dto.client,
        tags: dto.tags ?? [],
        boards: {
          create: [
            { title: 'Backlog', order: 0 },
            { title: 'In progress', order: 1 },
            { title: 'Review', order: 2 },
            { title: 'Done', order: 3 },
          ],
        },
      },
      include: { boards: { orderBy: { order: 'asc' } } },
    });
  }

  async findAll(userId: string, workspaceId?: string) {
    const membershipFilter = workspaceId ? { workspaceId } : undefined;
    const memberships = await this.prisma.workspaceMembership.findMany({ where: { userId } });
    const allowedWorkspaces = memberships.map((membership) => membership.workspaceId);
    if (workspaceId && !allowedWorkspaces.includes(workspaceId)) {
      throw new ForbiddenException('Access denied to workspace');
    }

    return this.prisma.project.findMany({
      where: {
        workspaceId: { in: allowedWorkspaces },
        isArchived: false,
        ...(workspaceId ? { workspaceId } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      include: { owner: true, boards: true },
    });
  }

  async findProject(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        boards: {
          orderBy: { order: 'asc' },
          include: { tasks: true },
        },
        owner: true,
        workspace: {
          include: {
            members: {
              include: { user: true },
            },
          },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.requireMembership(project.workspaceId, userId);
    return project;
  }
}
