import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteWorkspaceMemberDto } from './dto/invite-workspace-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.workspacesService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.workspacesService.findOne(id, req.user.id);
  }

  @Get(':id/summary')
  async summary(@Req() req: any, @Param('id') id: string) {
    return this.workspacesService.getSummary(id, req.user.id);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(req.user.id, dto);
  }

  @Post(':id/invite')
  async invite(@Req() req: any, @Param('id') id: string, @Body() dto: InviteWorkspaceMemberDto) {
    return this.workspacesService.inviteMember(id, req.user.id, dto);
  }

  @Patch(':id/members/:memberId')
  async updateMember(@Req() req: any, @Param('id') workspaceId: string, @Param('memberId') memberId: string, @Body() dto: UpdateMemberRoleDto) {
    return this.workspacesService.updateMemberRole(workspaceId, req.user.id, memberId, dto.role);
  }
}
