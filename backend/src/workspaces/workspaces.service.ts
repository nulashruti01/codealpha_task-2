import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteWorkspaceMemberDto } from './dto/invite-workspace-member.dto';
import { WorkspaceRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  private slugify(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
  }

  private async requireMembership(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMembership.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
      include: { workspace: true },
    });
    if (!membership) {
      throw new ForbiddenException('Access denied to workspace');
    }
    return membership;
  }

  async findAll(userId: string) {
    return this.prisma.workspaceMembership.findMany({
      where: { userId },
      include: { workspace: { include: { owner: true } } },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async findOne(workspaceId: string, userId: string) {
    await this.requireMembership(workspaceId, userId);
    return this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: { include: { user: true } },
        projects: { orderBy: { updatedAt: 'desc' } },
      },
    });
  }

  async create(userId: string, dto: CreateWorkspaceDto) {
    const slug = `${this.slugify(dto.name)}-${Math.random().toString(36).slice(2, 8)}`;
    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        brandName: dto.brandName,
        brandColor: dto.brandColor || '#4f46e5',
        ownerId: userId,
        members: {
          create: { userId, role: WorkspaceRole.OWNER },
        },
      },
    });
    return workspace;
  }

  async inviteMember(workspaceId: string, userId: string, dto: InviteWorkspaceMemberDto) {
    const membership = await this.requireMembership(workspaceId, userId);
    if (
      membership.role !== WorkspaceRole.OWNER &&
      membership.role !== WorkspaceRole.ADMIN &&
      membership.role !== WorkspaceRole.MANAGER
    ) {
      throw new ForbiddenException('You do not have permission to invite team members');
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User with this email was not found');
    }

    const existing = await this.prisma.workspaceMembership.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });
    if (existing) {
      throw new BadRequestException('User already belongs to this workspace');
    }

    return this.prisma.workspaceMembership.create({
      data: {
        userId: user.id,
        workspaceId,
        role: dto.role,
      },
      include: { user: true, workspace: true },
    });
  }

  async updateMemberRole(workspaceId: string, actorId: string, memberId: string, role: WorkspaceRole) {
    const membership = await this.requireMembership(workspaceId, actorId);
    if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
      throw new ForbiddenException('Only owners and admins can change member roles');
    }

    const member = await this.prisma.workspaceMembership.findUnique({
      where: { id: memberId },
      include: { workspace: true },
    });
    if (!member || member.workspaceId !== workspaceId) {
      throw new NotFoundException('Workspace member not found');
    }

    return this.prisma.workspaceMembership.update({
      where: { id: memberId },
      data: { role },
    });
  }

  async getSummary(workspaceId: string, userId: string) {
    await this.requireMembership(workspaceId, userId);
    const now = new Date();

    const [projects, tasks, members, sprints] = await Promise.all([
      this.prisma.project.findMany({
        where: { workspaceId, isArchived: false },
      }),
      this.prisma.task.findMany({
        where: { project: { workspaceId }, isArchived: false },
      }),
      this.prisma.workspaceMembership.count({ where: { workspaceId } }),
      this.prisma.sprint.findMany({ where: { workspaceId } }),
    ]);

    const activeProjects = projects.filter((project) => project.status === 'ACTIVE').length;
    const completedProjects = projects.filter((project) => project.status === 'COMPLETED').length;
    const delayedProjects = projects.filter((project) => project.dueDate && project.dueDate < now && project.status !== 'COMPLETED').length;
    const tasksDueToday = tasks.filter((task) => task.dueDate && task.dueDate.toDateString() === now.toDateString()).length;
    const overdueTasks = tasks.filter((task) => task.dueDate && task.dueDate < now && task.status !== 'DONE').length;
    const productivityScore = Math.min(100, Math.max(45, Math.round((completedProjects + tasks.filter((task) => task.status === 'DONE').length) * 3 + members * 2)));
    const velocity = sprints.reduce((sum, sprint) => sum + sprint.velocity, 0);
    const progress = projects.length ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length) : 0;

    const completionTrend = Array.from({ length: 7 }, (_, index) => ({
      label: `Day ${index + 1}`,
      value: Math.max(0, Math.min(20, Math.floor(Math.random() * 10 + 5 + index * 1.5))),
    }));

    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      delayedProjects,
      teamMembers: members,
      tasksDueToday,
      overdueTasks,
      productivityScore,
      sprintProgress: `${progress}%`,
      velocity,
      completionTrend,
      workloadBreakdown: [
        { label: 'Design', value: 28 },
        { label: 'Development', value: 42 },
        { label: 'QA', value: 18 },
        { label: 'Launch', value: 12 },
      ],
      releaseHealth: {
        onTrack: Math.round((activeProjects / Math.max(projects.length, 1)) * 100),
        recentBurndown: Array.from({ length: 6 }, (_, index) => 100 - index * 15),
      },
    };
  }
}
