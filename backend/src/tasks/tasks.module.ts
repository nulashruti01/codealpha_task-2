import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { ActivityGateway } from '../gateway/activity.gateway';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, ActivityGateway],
})
export class TasksModule {}
