import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

export class InviteWorkspaceMemberDto {
  @IsEmail()
  email!: string;

  @IsEnum(WorkspaceRole)
  role!: WorkspaceRole;

  @IsOptional()
  @IsString()
  message?: string;
}
