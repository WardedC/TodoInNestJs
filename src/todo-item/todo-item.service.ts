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
      title: createTodoItemDto.title,
      description: createTodoItemDto.description,
      is_done: false,
      date_created: new Date(),
      todoId: createTodoItemDto.todoId as any,
    });
    return this.repo.save(item);
  }

  findAll(): Promise<TodoItem[]> {
    return this.repo.find({ relations: ['todo'] });
  }

  async findOne(id: string | number): Promise<TodoItem> {
    const item = await this.repo.findOne({ where: { itemId: String(id) } as any, relations: ['todo'] });
    if (!item) throw new NotFoundException('TodoItem not found');
    return item;
  }

  async update(id: string | number, updateTodoItemDto: UpdateTodoItemDto): Promise<TodoItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateTodoItemDto);
    return this.repo.save(item);
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.repo.delete(String(id) as any);
    if (!result.affected) throw new NotFoundException('TodoItem not found');
  }
}
