import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaService } from './prisma.service';
import { HealthController } from './health.controller';
import { ActivityGateway } from './gateway/activity.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    WorkspacesModule,
    ProjectsModule,
    TasksModule,
    NotificationsModule,
  ],
  providers: [PrismaService, ActivityGateway],
  controllers: [HealthController],
})
export class AppModule {}
