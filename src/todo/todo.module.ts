import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoItem } from '../todo-item/entities/todo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoItem])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
