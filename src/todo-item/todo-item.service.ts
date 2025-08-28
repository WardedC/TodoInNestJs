import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { TodoItem } from './entities/todo-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoItemService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly repo: Repository<TodoItem>,
  ) {}

  create(createTodoItemDto: CreateTodoItemDto): Promise<TodoItem> {
    const item = this.repo.create({
      name: createTodoItemDto.name,
      isCompleted: createTodoItemDto.isCompleted || false,
      todoId: createTodoItemDto.todoId,
    });
    return this.repo.save(item);
  }

  findAll(): Promise<TodoItem[]> {
    return this.repo.find({ relations: ['todo'] });
  }

  async findOne(id: number): Promise<TodoItem> {
    const item = await this.repo.findOne({ where: { id }, relations: ['todo'] });
    if (!item) throw new NotFoundException('TodoItem not found');
    return item;
  }

  async update(id: number, updateTodoItemDto: UpdateTodoItemDto): Promise<TodoItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateTodoItemDto);
    return this.repo.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('TodoItem not found');
  }
}
