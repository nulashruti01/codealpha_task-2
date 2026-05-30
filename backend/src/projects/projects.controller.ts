import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { ProjectStatus, TaskPriority } from '@prisma/client';

class CreateProjectDto {
  title!: string;
  description?: string;
  workspaceId!: string;
  status?: ProjectStatus;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  budget?: number;
  client?: string;
  tags?: string[];
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Req() req: any, @Query('workspaceId') workspaceId?: string) {
    return this.projectsService.findAll(req.user.id, workspaceId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.findProject(id, req.user.id);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, dto);
  }
}
