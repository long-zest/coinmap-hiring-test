import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TaskEntity]), 
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TypeOrmModule.forFeature([TaskEntity])]
})
export class TasksModule {}
