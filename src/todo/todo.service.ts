
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoItem } from '../todo-item/entities/todo-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface BaseResponse<T> {
  status: string;
  data: T;
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly repo: Repository<Todo>,
    @InjectRepository(TodoItem)
    private readonly todoItemRepo: Repository<TodoItem>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<BaseResponse<Todo>> {
    const todo = this.repo.create(createTodoDto);
    const saved = await this.repo.save(todo);
    return { status: 'success', data: saved };
  }

  findAll(): Promise<Todo[]> {
    return this.repo.find();
  }
  
  findAllWithItems(): Promise<Todo[]> {
    return this.repo.find({ relations: ['items'] });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.repo.findOne({ where: { id } as any, relations: ['items'] });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return this.repo.save(todo);
  }

  async remove(id: string): Promise<void> {
    // 1. Primero verificar que el todo existe
    const todo = await this.repo.findOne({ where: { id: id as any } });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    
    // 2. Eliminar todos los TodoItems que pertenecen a este Todo
    await this.todoItemRepo.delete({ todoId: id as any });
    
    // 3. Ahora eliminar el Todo
    await this.repo.delete(id as any);
  }
}
